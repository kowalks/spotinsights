from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('callback', callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('top-tracks', TopTracks.as_view()),
    path('recibofy', Recibofy.as_view()),
    path('profileimage', UserProfileImage.as_view()),
    path('top-artist', TopArtists.as_view()),
    path('path-finder', PathFinder.as_view()),
]
