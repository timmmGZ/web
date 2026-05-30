from django.contrib import admin
from django.urls import path

from authentication import views

urlpatterns = [
    path('users/', views.UserViewSet.as_view({
        'get': 'list',
        'post': 'register'
    })),
    path('register/', views.UserViewSet.as_view({
        'post': 'register'
    })),
    path('login/', views.UserViewSet.as_view({
        'post': 'login'
    })),
    path('logout/', views.UserViewSet.as_view({
        'post': 'logout'
    })),
    path('token_logged_in_user/', views.UserViewSet.as_view({
        'get': 'token_logged_in_user'
    })),
]
