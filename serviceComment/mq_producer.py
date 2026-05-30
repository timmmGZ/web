import json
import pika
import random
from threading import Thread

import mq_connection_adapter

mq_cluster = mq_connection_adapter.get_cluster()
for node in mq_cluster:
    Thread(target=mq_connection_adapter.connect, args=(node, 'queue1')).start()


def publish(method, body):
    random.shuffle(mq_cluster)
    for i, node in enumerate(mq_cluster):
        # PERSISTENT_DELIVERY_MODE: message will not be deleted after starting rabbitmq
        try:
            # Enabled delivery confirmations for e.g. keyword 'mandatory'
            node['channel'].confirm_delivery()
            properties = pika.BasicProperties(method, delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE)
            node['channel'].basic_publish(exchange='', routing_key='queue1', body=json.dumps(body),
                                          properties=properties, mandatory=True)
            return  # "mandatory=True"confirm if the queue exists, add the queue if not exist
        except Exception as e:
            print("#producer#", e)
            Thread(target=mq_connection_adapter.connect, args=(node, 'queue1')).start()
    raise Exception("All rabbitmq nodes are down.")
