import json
import pika
from threading import Thread

import mq_connection_adapter
from main import Song, db


def consume_method(node):
    while True:
        try:
            for method, properties, body in node.get('channel').consume("queue2", inactivity_timeout=1):
                if body is None:
                    continue
                data = json.loads(body)
                if properties.content_type == 'like':
                    song = Song.objects.get(id=data)
                    song.likes += 1
                    song.save()
                elif properties.content_type == 'song_created':
                    song = Song(**(lambda  likes, **kw: kw)(**data))
                    db.session.add(song)
                    db.session.commit()
                elif properties.content_type == 'song_updated':
                    song = Song.query.get(data['id'])
                    song.url = data['url']
                    song.album = data['album']
                    song.soundcloud_song_id = data['soundcloud_song_id']
                    song.song_name = data['song_name']
                    song.artist = data['artist']
                    db.session.commit()
                elif properties.content_type == 'song_deleted':
                    song = Song.query.get(data)
                    db.session.delete(song)
                    db.session.commit()
                node['channel'].basic_ack(delivery_tag=method.delivery_tag)

        except Exception as e:
            print("#consumer#",e)
            # (not is_exist or not is_opening) and not restarting<=>not(is_exist and is_open)and not restart
            while not (node.get('channel') and node['channel'].is_open):  # or node['restarting']):
                mq_connection_adapter.connect(node, 'queue2')


mq_cluster = mq_connection_adapter.get_cluster()
for node in mq_cluster:
    mq_connection_adapter.connect(node, 'queue2')
    Thread(target=consume_method, args=(node,)).start()
