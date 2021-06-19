from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('callback', callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view())
]