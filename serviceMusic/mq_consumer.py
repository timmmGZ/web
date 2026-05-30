import django
import json
import os
from threading import Thread

import mq_connection_adapter

# manage.py is outside of the django project, we have to add it to INSTALLED_APPS
# in order to use some files inside the project e.g. models.py, command below:
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "serviceMusic.settings")
django.setup()
from music.models import Song


def consume_method(node):
    while True:
        try:
            for method, properties, body in node.get('channel').consume("queue1", inactivity_timeout=1):
                if body is None:
                    continue
                if properties.content_type == 'like':
                    id = json.loads(body)
                    song = Song.objects.get(id=id)
                    song.likes += 1
                    song.save()
                elif properties.content_type == 'unlike':
                    id = json.loads(body)
                    song = Song.objects.get(id=id)
                    song.likes -=1
                    song.save()
                node['channel'].basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print("consumer", e)
            # (not is_exist or not is_opening) and not restarting<=>not(is_exist and is_open)and not restart
            while not (node.get('channel') and node['channel'].is_open):  # or node['restarting']):
                mq_connection_adapter.connect(node, 'queue1')


mq_cluster = mq_connection_adapter.get_cluster()
for node in mq_cluster:
    mq_connection_adapter.connect(node, 'queue1')
    Thread(target=consume_method, args=(node,)).start()
