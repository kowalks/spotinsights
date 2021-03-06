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
        time_range = request.GET.get('time_range', 'medium_term')

        endpoint = 'me/top/tracks'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit, 'time_range': time_range})

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
            'description': 'Suas m??sicas mais ouvidas em 2021.',
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


class UserProfileImage(APIView):       #puxa a foto de perfil do usu??rio
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


class TopGenres(APIView):          #puxa os g??neros musicais do top 3 dos artistas
    def get(self, request, format=None):
        limit = request.GET.get('limit', 5)

        endpoint = 'me/top/artists'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint, extra={'limit': limit})

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        items = response.get('items')

        genres = []

        for item in items:
            for genre in item.get('genres'):
                if genre not in genres:
                    genres += [genre]

        return Response({'genres': genres}, status=status.HTTP_200_OK)


class UserDevice(APIView):        #retorna as infos como id, is_active, name (e.g. Android), type (e.g. Smartphone)
    def get(self, request, format=None):  #retorna as infos APENAS se o usu??rio est?? usando o app

        endpoint = 'me/player/devices'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint)

        if 'error' in response or 'devices' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        device_info = response.get('devices')

        return Response(device_info, status=status.HTTP_200_OK)


class Recommendations(APIView):                #faz 3 recomenda????es a partir dos ids dos top artistas e top generos
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
        #pegando os top g??neros
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

        #########################
        #pegando as recomenda????es
        limit = request.GET.get('limit', 10)
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
                'artists': response.get('tracks')[i]['artists'][0]['name'],
                'img': response.get('tracks')[i]['album']['images'][0]['url'],
                'url':response.get('tracks')[i]['external_urls']['spotify']
            })
        

        return Response(recommendations, status=status.HTTP_200_OK)

        
        

class PathFinder(APIView):
    def get(self, request, format=None):
        start_artist = request.GET.get('start_artist','Ed Sheeran')
        end_artist = request.GET.get('end_artist', 'Anitta')
        
        endpoint = 'search'

        start_id_item = spotify_api_request(request.session.session_key, endpoint, extra={'q': start_artist, 'type': 'artist', 'limit': 1}).get('artists').get('items')
        end_id_item = spotify_api_request(request.session.session_key, endpoint, extra={'q': end_artist, 'type': 'artist', 'limit': 1 }).get('artists').get('items')

        start_id = start_id_item[0].get('id')
        end_id = end_id_item[0].get('id')

        if start_id == end_id:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        visited = PathFinder.BFS(request, start_id, end_id)
        return PathFinder.collect_info(request, visited, start_id, end_id)

    # Breadth-first search algorithm
    def BFS(request, start_id, end_id):
        endpoint = f'artists/{start_id}/'
        queue = [start_id]
        initial_artist = spotify_api_request(request.session.session_key, endpoint)
        visited = {
            start_id: {
                'artist_id': start_id,
                'parent_id': start_id,
                'artist_name': initial_artist.get('name'),
                'track': None,
            }
        }

        while queue:
            artist_id = queue.pop(0)

            artist_name = visited[artist_id]['artist_name']
            print(f'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ARTIST: {artist_name}')

            tracks = PathFinder.tracks_from_artists(request, artist_id)
            
            if not tracks:
                continue


            for track in tracks:
                feats = track.get('artists')
                for feat in feats:
                    feat_id = feat.get('id')
                    if not feat_id in visited:
                        print(feat.get('name'))
                        visited[feat_id] = {
                            'artist_id': feat_id,
                            'artist_name': feat.get('name'),
                            'parent_id': artist_id,
                            'track': track.get('name'),
                            'track_id': track.get('id'),
                        }
                        if feat_id == end_id:
                            return visited
                        queue += [feat_id]
                            

    def collect_info(request, visited, start_id, end_id):
        all_nodes = []
        all_edges = []
        all_tracks = []
        nodes = []
        edges = []

        while end_id != start_id:
            info = visited[end_id]
            nodes += [{
                'id': end_id, 
                'label': info.get('artist_name'),
                'color': {'border': 'blue', 'background': "#3192b3"},
                'font': {'bold': "true", 'size': '20'}, 
                'shape': 'circularImage',
                'size': '40',
              }]
            all_nodes += [end_id]
            
            all_tracks += [info.get('track_id')]

            edges += [{'from': info.get('parent_id'), 'to': end_id, 'label': info.get('track'), 'length': '200'}]
            all_edges += [(info.get('parent_id'), end_id)]
            
            end_id = info.get('parent_id')

        nodes += [{
            'id': start_id,
            'label': visited[start_id].get('artist_name'),
            'color': {'border': 'blue', 'background': "#3192b3"}, 
            'font': {'bold': "true", 'size': '20', 'color': 'black'},
            'shape': 'circularImage',
            'size': '40',
        }]
        all_nodes += [start_id]

        # Node Images
        images = PathFinder.get_multiple_images(request, all_nodes)
        for i, node in enumerate(nodes):
            node['image'] = images[i]

        # Tracks Path
        path = PathFinder.get_info(request, all_tracks)

        # Other nodes
        path_nodes = nodes.copy()
        for node in path_nodes:
            node_id = node['id']
            tracks = PathFinder.tracks_from_artists(request, node_id)

            for track in tracks:
                feats = track.get('artists')
                for feat in feats:
                    feat_id = feat.get('id')
                    if not feat_id in all_nodes:
                       nodes += [{'id': feat_id, 'label': feat.get('name'), 'color': '#d3d3d3', 'font': {'color': "#d3d3d3"}, 'shape': 'dot', 'size': '10'}]
                       all_nodes += [feat_id]
                    if feat_id != node_id and not (node_id, feat_id) in all_edges:
                        edges += [{'from': node_id, 'to': feat_id, 'label': '', 'length': '100'}]
                        all_edges += [(node_id, feat_id)]

        return Response({'graph': {'nodes': nodes, 'edges': edges}, 'path': path}, status=status.HTTP_200_OK)

    def get_multiple_images(request, artist_ids):
        endpoint = f'artists/'
        form_ids = ','.join(artist_ids)

        response = spotify_api_request(request.session.session_key, endpoint, extra={'ids': form_ids})
        images = [artist.get('images')[0].get('url') for artist in response.get('artists')]

        return images

    def get_info(request, track_ids):
        endpoint = f'tracks/'
        form_ids = ','.join(track_ids)

        response = spotify_api_request(request.session.session_key, endpoint, extra={'ids': form_ids})
        info = [{
            "img" : track.get('album').get('images')[0].get('url'),
            "name"  : track.get('name'),
            "url"  : track.get('external_urls').get('spotify'),
            "artists" : '',
            } for track in response.get('tracks')]

        return info

    def tracks_from_artists(request, artist_id):
        endpoint = f'artists/{artist_id}/albums'
        albums = spotify_api_request(request.session.session_key, endpoint).get('items')
        album_ids = ','.join([album.get('id') for album in albums])
        endpoint = 'albums/'
        albums = spotify_api_request(request.session.session_key, endpoint, extra={'ids': album_ids})

        # return albums

        tracks = []
        album_name = {}
        
        if not albums.get('albums'):
            return None

        for album in albums.get('albums'):
            if album.get('album_type') != 'compilation':
                trks = album.get('tracks').get('items')
                tracks += [{'name': trk.get('name'), 'artists': trk.get('artists'), 'id': trk.get('id')} for trk in trks]
        
        return tracks


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

    