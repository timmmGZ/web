# Microservices-with-Docker

## Gif preview
![image](https://github.com/timmmGZ/Microservices-with-Docker/blob/main/images/web.gif)
## Brief Introduction
![image](https://github.com/timmmGZ/Microservices-with-Docker/blob/main/images/microservices.jpg)
The main app service consists of two sub-services: music inventory service, and session-based authentication service.  
Comment/Like service is the service for the comment and like functionality, some part of the music inventory is also replicated here as backup, and some fields like likes_count will not be replicated since they can be calculated in this service.  
API gateway nodes and message queue nodes are for load balancing and security. The whole server is down when the last functioning API gateway node is down. Some of the functionalities are disabled to ensure consistency among databases when the last functioning message queue node is down, therefore, the user will get a service error response from the server until the server restarts any of the nodes.  

## Linux  
Start the Docker service(Docker daemon) first, then run the below code. Enter http://localhost after the deployment process is done. 
```
git clone https://github.com/timmmGZ/Microservices-with-Docker &&
cd Microservices-with-Docker &&
bash start_all_services.sh
```
### If you don't have Docker service installed
1. Go to [Play with Docker - Docker Playground](https://labs.play-with-docker.com/)
2. Register and login, click "ADD NEW INSTANCE"
3. Run the above code as well.
4. Click the exposed port 80  

However, there are not always enough machines. Also, the virtual machine has variable space of less than 4GB even if it shows 4GB, so sometimes the deployment might fail when the site is too busy.  

Admin url is http://localhost/admin/songs/

![image](https://github.com/timmmGZ/Microservices-with-Docker/blob/main/images/docker.jpg)
## Windows  
Start the Docker service(Docker daemon) by opening Docker Desktop first, then run start_all_services.bat. Enter http://localhost after the deployment process is done. 
# Ports
80: Frontend  
8001:  Inventory and Account API  
8002:  Comment/Like API  
8081:  API gateway  
15672:  RabbitMQ node 1  
15673:  RabbitMQ node 2  
33061: mysql for Inventory and Account API. DB name: music  
33062: mysql for Comment/Like API. DB name: comment  
All possible account: test, password: 123  
All database root password: root123456  
