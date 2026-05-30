from django.db import models


class Song(models.Model):
    url = models.CharField(max_length=200)
    album = models.CharField(max_length=100)
    song_name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    likes = models.PositiveIntegerField(default=0)
    soundcloud_song_id = models.PositiveIntegerField(null=True)
