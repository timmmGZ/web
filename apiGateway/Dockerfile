FROM node:alpine
WORKDIR /app
#"npm install" is only useful for the first time creating the node_modules
CMD echo 'Starting the app'; [ ! -d /app/node_modules ] && npm install;set HTTPS=true && npm start

