from django.db import transaction
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Song
from .mq_producer import publish
from .serializers import SongSerializer


class SongViewSet(viewsets.ViewSet):
    def list(self, request):  # api/songs
        if request.GET.get('keyword', ''):
            keyword = request.GET.get('keyword', '')
            songs = Song.objects.filter(
                Q(song_name__icontains=keyword) | Q(artist__icontains=keyword) | Q(album__icontains=keyword))
        else:
            songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    # rollback if publish() raise errors, else it breaks the consistency between two database
    @transaction.atomic
    def c(self, request):  # api/songs
        dictionary = request.data
        if request.data.get('_content'):
            dictionary = eval(request.data['_content'])
        serializer = SongSerializer(data=dictionary)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Song.objects.create(**dictionary)
        publish('song_created', serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def r(self, request, pk=None):  # api/songs/<str:pk>
        song = Song.objects.get(id=pk)
        serializer = SongSerializer(song)
        return Response(serializer.data)

    @transaction.atomic
    def u(self, request, pk=None):  # api/songs/<str:pk>
        #select_for_update() adds pessimistic lock to the filtered rows, then def u() commits only after the end of transaction.
        song = Song.objects.select_for_update().get(id=pk)
        # Song.objects.filter(pk=pk).update(**request.data.dict())
        data=request.data
        #update the new soundcloud_song_id everytime the url field is updated
        if not data.get('soundcloud_song_id') and data.get('url')!=song.url:
            data['soundcloud_song_id']=None
        serializer = SongSerializer(instance=song, data=data, partial=True)
        #'is_valid' raises badrequest400 if some non-null field is blank
        serializer.is_valid(raise_exception=True)
        # You cannot call `.save()` after accessing `serializer.data`.If you need to access data before committing to the database then inspect 'serializer.validated_data' instead.
        serializer.save()  # Song.objects.update(request.data)
        publish('song_updated', serializer.data)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    @transaction.atomic
    def d(self, request, pk=None):  # api/songs/<str:pk>
        song = Song.objects.get(id=pk)
        publish('song_deleted', pk)
        song.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
