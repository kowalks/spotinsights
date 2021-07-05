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
        if authenticated:
            endpoint = 'me/'
            user = spotify_api_request(request.session.session_key, endpoint)           
            
            metadata = {
                'profile': user.get('images')[0].get('url'),
                'name': user.get('display_name'),
                'email': user.get('email'),
                'country': user.get('country'),
                'id': user.get('id')
                }
        else:
            metadata = None

        return Response(
            {
            'status': authenticated, 
            'metadata': metadata
            }, 
            status=status.HTTP_200_OK)


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
            id = song.get('id')
            min, sec = ms_to_min_sec(duration)
            uri = song.get('uri')
            qrcode = f'https://scannables.scdn.co/uri/plain/jpeg/3F51B5/white/640/{uri}'
            img = song.get('album').get('images')[0].get('url')
            tracks.append(dict(id=id,name=name, artists=artists, position=position, rating=rating, min=min, sec=sec, uri=uri, qrcode=qrcode, img=img))

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


class UserProfileImage(APIView):       #puxa a foto de perfil do usuário
    def get(self, request, format=None):

        endpoint = 'me/'
        user_id = spotify_api_request(request.session.session_key, endpoint).get('id')

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint)

        if 'error' in response or 'images' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
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
            artists.append(dict(name=name, position=position, rating=rating, artist_id=artist_id,img=img))

        sponse = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        return Response(artists, status=status.HTTP_200_OK)



##########################brainstorms


class TopGenres(APIView):          #puxa os gêneros musicais do top 3 dos artistas
    def get(self, request, format=None):
        limit = request.GET.get('limit', 3)

        endpoint = 'me/top/artists'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')

        genres = []

        for i in range(0, len(items)):
            for j in range(0, len(items[i]['genres'])):
                genres.append(items[i]['genres'][j]) #retorna um lista com os gêneros mais tops
        
        genres = {'genres': genres}

        return Response(genres, status=status.HTTP_200_OK)


class UserDevice(APIView):        #retorna as infos como id, is_active, name (e.g. Android), type (e.g. Smartphone)
    def get(self, request, format=None):  #retorna as infos APENAS se o usuário está usando o app

        endpoint = 'me/player/devices'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint)

        if 'error' in response or 'devices' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        device_info = response.get('devices')

        return Response(device_info, status=status.HTTP_200_OK)


class Recommendations(APIView):                #faz 3 recomendações a partir dos ids dos top artistas e top generos
    def get(self, request, format=None):

        ################################
        #pegando os ids dos top artistas
        limit = request.GET.get('limit', 10)
        endpoint = 'me/top/artists'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')

        seed_artists = []

        for i, artist in enumerate(items):
            artist_id = artist.get('id')
            seed_artists.append(str(artist_id))


        #######################
        #pegando os top gêneros
        limit = request.GET.get('limit', 5)
        endpoint = 'me/top/artists'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')

        seed_genres = []

        for i in range(0, len(items)):
            for j in range(0, len(items[i]['genres'])):
                seed_genres.append(items[i]['genres'][j])
        
        print(seed_genres)
        print(seed_artists)


        #########################
        #pegando as recomendações
        limit = request.GET.get('limit', 3)
        endpoint = 'recommendations'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit, 'seed_artists': seed_artists, 'seed_genres': seed_genres})

        if 'error' in response or 'tracks' not in response:
            return Response({"oi"}, status=status.HTTP_204_NO_CONTENT)

        recommendations = []
        
        for i in range(0, len(response.get('tracks'))):
            recommendations.append({
                'name': response.get('tracks')[i]['name'],
                'artist': response.get('tracks')[i]['artists'],
                'album': response.get('tracks')[i]['album']['images'],
            })
        

        return Response(recommendations, status=status.HTTP_200_OK)

        

class PathFinder(APIView):
    def get(self, request, format=None):
        start_artist = request.GET.get('start_artist','Justin Bieber')
        end_artist = request.GET.get('end_artist', 'ANAVITORIA')
        
        endpoint = 'search'

        start_id_item = spotify_api_request(request.session.session_key, endpoint, extra={'q': start_artist, 'type': 'artist', 'limit': 1}).get('artists').get('items')
        end_id_item = spotify_api_request(request.session.session_key, endpoint, extra={'q': end_artist, 'type': 'artist', 'limit': 1 }).get('artists').get('items')

        start_id = start_id_item[0].get('id')
        end_id = end_id_item[0].get('id')

        if start_id == end_id:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        visited = PathFinder.BFS(request, start_id, end_id)
        return PathFinder.collect_info(visited, start_id, end_id)

    # Breadth-first search algorithm
    def BFS(request, start_id, end_id):
        endpoint = f'artists/{start_id}/'
        queue = [start_id]
        visited = {
            start_id: {
                'artist_id': start_id,
                'parent_id': start_id,
                'artist_name': spotify_api_request(request.session.session_key, endpoint).get('name'),
                'track': None
            }
        }

        while queue:
            artist_id = queue.pop(0)

            endpoint = f'artists/{artist_id}/albums'
            albums = spotify_api_request(request.session.session_key, endpoint).get('items')
            album_ids = ','.join([album.get('id') for album in albums])
            endpoint = 'albums/'
            albums = spotify_api_request(request.session.session_key, endpoint, extra={'ids': album_ids})

            # return albums

            tracks = []
            for album in albums.get('albums'):
                trks = album.get('tracks').get('items')
                tracks += [{'name': trk.get('name'), 'artists': trk.get('artists')} for trk in trks]
            
            # return tracks

            for track in tracks:
                feats = track.get('artists')
                for feat in feats:
                    feat_id = feat.get('id')
                    print(feat.get('name'))
                    if not feat_id in visited:
                        visited[feat_id] = {
                            'artist_id': feat_id,
                            'artist_name': feat.get('name'),
                            'parent_id': artist_id,
                            'track': track.get('name')
                        }
                        if feat_id == end_id:
                            return visited
                        queue += [feat_id]
                            

    def collect_info(visited, start_id, end_id):
        nodes = []
        edges = []

        id = 1
        while end_id != start_id:
            info = visited[end_id]
            nodes += [{'id': id, 'label': info.get('artist_name')}]
            edges += [{'from': id+1, 'to': id, 'label': info.get('track')}]
            id += 1
            end_id = info.get('parent_id')


        nodes += [{'id': id, 'label': visited[start_id].get('artist_name')}]


        print(nodes)
        return Response({'nodes': nodes, 'edges': edges}, status=status.HTTP_204_NO_CONTENT)


class AudioAnalysis(APIView):
    def get(self, request, format=None):
        limit = request.GET.get('limit', 10)
        endpoint = 'me/top/tracks'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')

        ids = []
        for i, track in enumerate(items):
            ids += [track.get('id')]
        infos = []
        for id in ids:
            new_endpoint = f'audio-features/{id}'
            infos += [spotify_api_request(request.session.session_key, new_endpoint)]

        danceability = 0
        energy = 0
        speechiness = 0
        acousticness = 0
        instrumentalness = 0
        liveness = 0

        for info in infos:
            danceability += info.get('danceability')* 10
            energy += info.get('energy') * 10
            speechiness += info.get('speechiness') * 10
            acousticness += info.get('acousticness') * 10
            instrumentalness += info.get('instrumentalness') * 10
            liveness += info.get('liveness') * 10
        liveness = round(liveness)
        instrumentalness = round(instrumentalness)
        acousticness = round(acousticness)
        speechiness = round(speechiness)
        energy = round(energy)
        danceability = round(danceability)
        audio_data = []
        audio_data.append(dict(label='liveness',value=liveness))
        audio_data.append(dict(label='instrumentalness', value=instrumentalness))
        audio_data.append(dict(label='acousticness', value=acousticness))
        audio_data.append(dict(label='speechiness', value=speechiness))
        audio_data.append(dict(label='energy', value=energy))
        audio_data.append(dict(label='danceability', value=danceability))
      
        return Response(audio_data, status=status.HTTP_200_OK)

    