@echo off
docker compose -f ./serviceRabbitMQ/docker-compose.yaml up -d
docker compose -f ./serviceMusic/docker-compose.yaml up -d

echo "Waiting for backend initialization"
:wait_for_backend
docker logs servicemusic-backend-1 2> NUL| findstr 8000

if errorlevel 1 (
    timeout 5 >NUL
    goto wait_for_backend
) 

docker compose -p servicemusic exec backend python test.py
echo "Sample songs inserted into the backend database"

docker compose -f ./serviceComment/docker-compose.yaml up -d
docker compose -f ./apiGateway/docker-compose.yaml up -d
docker compose -f ./serviceFrontend/docker-compose.yaml up -d

echo "Waiting for frontend initialization"
:wait_for_frontend
curl http://localhost 2>NUL

if errorlevel 1 (
    timeout 5 >NUL
    goto wait_for_frontend
) else (
    start http://localhost
)


