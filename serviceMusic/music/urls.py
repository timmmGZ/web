from django.urls import path

from .views import SongViewSet

urlpatterns = [
    path('songs/', SongViewSet.as_view({
        'get': 'list',
        'post': 'c'
    })),  # not necessary to be pk(just need to be the same as in views,py), but DRF need it to be pk
    path('songs/<str:pk>', view=SongViewSet.as_view({
        'put': 'u',
        'get': 'r',
        'delete': 'd'
    })),
]
