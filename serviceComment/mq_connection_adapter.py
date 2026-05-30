import pika
import time

# set heartbeat to 0 to prevent channel auto-close
mq_cluster = [{'url': 'amqp://test:123@host.docker.internal:5672?heartbeat=0'},
              {'url': 'amqp://test:123@host.docker.internal:5673?heartbeat=0'}]

inactivity_reconnect_timeout = 1.25
for node in mq_cluster:
    node['restarting'] = False


def connect(node, declare_queue=None):
    global inactivity_reconnect_timeout
    if node['restarting']:
        return
    try:
        node['restarting'] = True
        if inactivity_reconnect_timeout < 300:
            inactivity_reconnect_timeout = inactivity_reconnect_timeout ** 1.033
        time.sleep(inactivity_reconnect_timeout)
        connection = pika.BlockingConnection(pika.URLParameters(node['url']))
        node['channel'] = connection.channel()
        node['channel'].queue_declare(queue=declare_queue, durable=True)
        inactivity_reconnect_timeout = 1.25
    except pika.exceptions.IncompatibleProtocolError as e:
        # rabbitmq node is restarting or exiting, pika.BlockingConnection will raise
        # exception immediately, set interval to 2 seconds between reconnections
        time.sleep(2)
    except Exception as e:  # probably when the node is down, pika.BlockingConnection will wait
        # print("#mq_adapter#", e)  # for few seconds before raising exception, probably AMQPConnectorStackTimeout
        pass
    finally:
        node['restarting'] = False


def get_cluster():
    return mq_cluster.copy()
