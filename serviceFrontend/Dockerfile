FROM node:alpine
#create-react-app is useful for the first time creating the app
#RUN npx create-react-app app --template typescript
WORKDIR /app
#"npm install" is only useful for the first time creating the node_modules
CMD echo 'Starting the app'; [ ! -d /app/node_modules ] && npm install; npm start

