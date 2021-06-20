from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import *
from requests import post, put, get


BASE_URL = 'http://api.spotify.com/v1/me/'


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            token_type=token_type,
            expires_in=expires_in,
            refresh_token=refresh_token)
        tokens.save()


def is_authenticated(session_id):
    tokens = get_user_tokens(session_id)

    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            get_refreshed_token(session_id)

        return True

    return False


def get_refreshed_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token



    base_url = 'https://accounts.spotify.com/api/token'
    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    response = post(base_url, data=payload).json()

    # refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    access_token = response.get('access_token')
    expires_in = response.get('expires_in')

    update_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)


def spotify_api_request(session_id, endpoint, is_post=False, is_put=False):
    tokens = get_user_tokens(session_id)

    payload = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }

    if is_post:
        post(BASE_URL + endpoint, headers=payload)
    if is_put:
        put(BASE_URL + endpoint, headers=payload)

    response = get(BASE_URL + endpoint, {}, headers=payload)

    try:
        return response.json()
    except:
        return {'error': 'Problem with Spotify API request'}
