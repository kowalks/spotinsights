from django.shortcuts import redirect
from rest_framework.views import APIView
from requests import Request
from rest_framework import status
from rest_framework.response import Response
from .credentials import *
from requests import post
from .util import *
import base64


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = [
            'ugc-image-upload',
            'user-read-recently-played',
            'user-top-read',
            'user-read-playback-position',
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',
            'app-remote-control',
            'streaming',
            'playlist-modify-public',
            'playlist-modify-private',
            'playlist-read-private',
            'playlist-read-collaborative',
            'user-follow-modify',
            'user-follow-read',
            'user-library-modify',
            'user-library-read',
            'user-read-email',
            'user-read-private',
        ]

        base_url = 'https://accounts.spotify.com/authorize'
        payload = {
            'scope': ' '.join(scopes),
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID

        }
        url = Request('GET', base_url, params=payload).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def callback(request, format=None):
    code = request.GET.get('code')
    # error = request.GET.get('error')

    base_url = 'https://accounts.spotify.com/api/token'
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    response = post(base_url, data=payload).json()

    # error = response.get('error')

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        authenticated = is_authenticated(request.session.session_key)
        return Response({'status': authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        endpoint = 'me/player/currently-playing'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        id = item.get('artists')[0].get('id')
        artists = stringfy(item.get('artists'), lambda x: x.get('name'))


        duration = item.get('duration_ms')
        min = floor(duration/60000)
        sec = floor((duration % 60000)/1000)

        song = {
            'title': item.get('name'),
            'artist': artists,
            'duration': duration,
            'time': response.get('progress_ms'),
            'album': item.get('album').get('name'),
            'image_url': item.get('album').get('images')[0].get('url'),
            'song_id': item.get('id'),
            'popularity': item.get('popularity'),
            'min': min,
            'sec': sec,
            'id': id,
        }

        return Response(song, status=status.HTTP_200_OK)


class TopTracks(APIView):
    def get(self, request, format=None):
        limit = request.GET.get('limit', 20)

        endpoint = 'me/top/tracks'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')
        tracks = []

        for i, song in enumerate(items):
            name = song.get('name')
            artists = stringfy(song.get('artists'), lambda x: x.get('name'))
            position = i+1
            rating = song.get('popularity')
            duration = song.get('duration_ms')
            min, sec = ms_to_min_sec(duration)
            uri = song.get('uri')
            qrcode = f'https://scannables.scdn.co/uri/plain/jpeg/3F51B5/white/640/{uri}'
            img = song.get('album').get('images')[0].get('url')
            tracks.append(dict(name=name, artists=artists, position=position, rating=rating, min=min, sec=sec, uri=uri, qrcode=qrcode, img=img))

        return Response(tracks, status=status.HTTP_200_OK)


class Recibofy(APIView):
    def post(self, request, format=None):
        tracks = TopTracks.get(self, request).data

        # User info
        endpoint = 'me/'
        user_id = spotify_api_request(request.session.session_key, endpoint).get('id')

        # Create playlist
        endpoint = f'users/{user_id}/playlists'
        playlist = spotify_api_request(request.session.session_key, endpoint, is_post=True, extra={
            'name': 'SpotInsights Hits',
            'description': 'Suas músicas mais ouvidas em 2021.',
            'public': False
        })

        playlist_id = playlist.get('id')
        playlist_uri = playlist.get('uri')
        
        # Upload custom image
        endpoint = f'playlists/{playlist_id}/images'
        with open('spotify/assets/cover_500.jpg', 'rb') as img:
            encoded = base64.b64encode(img.read())
            spotify_api_request(request.session.session_key, endpoint, is_put=True, extra=encoded)

        
        # Add itens to playlist
        endpoint = f'playlists/{playlist_id}/tracks'
        spotify_api_request(request.session.session_key, endpoint, is_post=True, extra={
            'uris': [item['uri'] for item in tracks]
        })

        # Defining response 
        response = {
            'tracks': tracks,
            'qrcode': f'https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/{playlist_uri}'
        }

        return Response(response, status=status.HTTP_200_OK)


class UserProfileImage(APIView):
    def get(self, request, format=None):

        # User info
        endpoint = 'me/'
        user_id = spotify_api_request(request.session.session_key, endpoint).get('id')
        
        # Upload custom image
        endpoint = f'users/{user_id}'
        image = spotify_api_request(request.session.session_key, endpoint).get('images')[0]['url']
        image = {'url':image}

        return Response(image, status=status.HTTP_200_OK)


class TopArtists(APIView):
    def get(self, request, format=None):
        limit = request.GET.get('limit', 10)

        endpoint = 'me/top/artists'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')

        artists = []

        for i, artist in enumerate(items):
            name = artist.get('name')
            #genres = get_genres(artist.get('genres'))
            position = i+1
            rating = artist.get('popularity')
            artist_id = artist.get('id')
            img = artist.get('images')[0].get('url')
            #incluir genres
            artists.append(dict(name=name, position=position, rating=rating, artist_id=artist_id,img=img))

        return Response(artists, status=status.HTTP_200_OK)


class PathFinder(APIView):
    def get(self, request, format=None):
        start_id = request.GET.get('start_id')
        end_id = request.GET.get('end_id')

        if start_id == end_id:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return PathFinder.BFS(request, start_id, end_id)

    # Breadth-first search algorithm
    def BFS(request, start_id, end_id):
        endpoint = ''
        queue = [start_id]
        visited = []

        while queue:
            artist_id = queue.pop(0)
            visited += [artist_id]

            endpoint = f'artists/{artist_id}/albums'
            albums = spotify_api_request(request.session.session_key, endpoint).get('items')

            for album in albums:
                album_id = album.get('id')
                endpoint = f'albums/{album_id}'
                tracks = spotify_api_request(request.session.session_key, endpoint).get('tracks').get('items')
                for track in tracks:
                    feats = track.get('artists')
                    for feat in feats:
                        feat_id = feat.get('id')
                        if not feat_id in visited:
                            if feat_id == end_id:
                                return Response(feat, status=status.HTTP_200_OK)
                            queue += [feat_id]


        return Response({}, status=status.HTTP_204_NO_CONTENT)

            
