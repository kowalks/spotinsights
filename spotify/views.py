from django.shortcuts import render, redirect
from .credentials import *
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *


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


        'user-read-playback-state user-modify-playback-state user-read-currently-playing'
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
        authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status': authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        endpoint = 'player/currently-playing'

        if not request.session.exists(request.session.session_key):
            request.session.create()

        response = spotify_api_request(request.session.session_key, endpoint)
        print(response)
        print('aaaa')

        return Response(response, status=status.HTTP_200_OK)
