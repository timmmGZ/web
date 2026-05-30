#!/bin/bash
docker compose -f ./serviceRabbitMQ/docker-compose.yaml up -d
docker compose -f ./serviceMusic/docker-compose.yaml up -d

echo "Waiting for backend initialization"
wait_for_backend (){ 
    docker logs servicemusic-backend-1 2>/dev/null | tail -5 | grep :8000 || return 1; 
    }
wait_for_backend
while [ $? != 0 ]; do
    sleep 1
    wait_for_backend
done	
docker compose -p servicemusic exec backend python test.py
echo "Sample songs inserted into the backend database"

docker compose -f ./serviceComment/docker-compose.yaml up -d
docker compose -f ./apiGateway/docker-compose.yaml up -d
docker compose -f ./serviceFrontend/docker-compose.yaml up -d

echo "Waiting for frontend initialization"
wait_for_frontend (){ 
    curl http://localhost 2>/dev/null; 
    }
wait_for_frontend
while [ $? != 0 ]; do
    sleep 1
    wait_for_frontend
done
