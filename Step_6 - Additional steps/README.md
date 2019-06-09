# Additional steps to get extra points on top of the "base" grade

## Load balancing: multiple server nodes (0.5pt)

* You extend the reverse proxy configuration to support **load balancing**. 
* You show that you can have **multiple static server nodes** and **multiple dynamic server nodes**. 
* You prove that the **load balancer** can distribute HTTP requests between these nodes.
* You have **documented** your configuration and your validation procedure in your report.

## Load balancing: round-robin vs sticky sessions (0.5 pt)

* You do a setup to demonstrate the notion of sticky session.
* You prove that your load balancer can distribute HTTP requests in a round-robin fashion to the dynamic server nodes (because there is no state).
* You prove that your load balancer can handle sticky sessions when forwarding HTTP requests to the static server nodes.
* You have documented your configuration and your validation procedure in your report.

## Dynamic cluster management (0.5 pt)

* You develop a solution, where the server nodes (static and dynamic) can appear or disappear at any time.
* You show that the load balancer is dynamically updated to reflect the state of the cluster.
* You describe your approach (are you implementing a discovery protocol based on UDP multicast? are you using a tool such as serf?)
* You have documented your configuration and your validation procedure in your report.

*To do those steps, the files of step 1 (with ajax) and 2 have been copied in "Load balancing and cluster/static" and "Load balancing and cluster/dynamic".*

### [Traefik](https://docs.traefik.io/)

To do these 3 steps, we decided to use Traefik. Traefik is a modern HTTP reverse proxy and load balancer that makes deploying microservices easy. It also provides a cluster mode (but in beta). So it's perfect for our need.

To add Traefik as reverse proxy, we had to modify our Dockerfile of our web sites and create a new image for Traefik.

To create the Traefik image, we need a new Dockerfile (in Load balancing and cluster/traefik). In this folder, there is a config file for Traefik in src/traefik.toml. this file is copied in the new container.
```
FROM traefik:latest

COPY src/traefik.toml /etc/traefik/traefik.toml
```

traefik.toml :
```
debug = true

# Web configuration backend
[web]
address = ":9000"

# Docker configuration
[docker]
domain = "labo-http.res.ch"
watch = true
```

After that, we had to modify the Dockerfile of the web sites

To the static web site Dockerfile, we added :
```
# Traefik configuration
LABEL "traefik.backend"="static"
LABEL "traefik.backend.loadbalancer.sticky"="false"
LABEL "traefik.frontend.rule"="PathPrefix: /"
LABEL "traefik.port"="80"
```
It configures the names of the nodes (static), the using of sticky sessions (in this case, false), the path prefix and the port

To the dynamic web site Dockerfile, we added :
```
# Traefik configuration
LABEL "traefik.backend"="dynamic"
LABEL "traefik.backend.loadbalancer.sticky"="true"
LABEL "traefik.frontend.rule"="PathPrefixStrip: /api/dates/"
LABEL "traefik.port"="80"
```
Here, the sticky sessions are actived.

#### Procedure of demo

Build the images for this steps
```
docker build -t res/traefik ./Load\ balancing\ and\ cluster/traefik/
docker build -t res/apache_php ./Load\ balancing\ and\ cluster/static/
docker build -t res/express ./Load\ balancing\ and\ cluster/dynamic/
```

Start Traefic container. the ```-v``` links the original Docker socket to the container socket. It allows the container to use Docker inside.
```
docker run -d -p 8080:80 -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock res/traefik
```

Start how many static or dynamic web sites you want
```
docker run -d res/apache_php
docker run -d res/express
```

To see the dashboard of Traefik, go to the URL ```http://labo-http.res.ch:9000/```. For the web site, this is always the same URL ```http://labo-http.res.ch:8080/```

We have a problem with the link to the 

## Management UI (0.5 pt)

* You develop a web app (e.g. with express.js) that administrators can use to monitor and update your web infrastructure.
* You find a way to control your Docker environment (list containers, start/stop containers, etc.) from the web app. For instance, you use the Dockerode npm module (or another Docker client library, in any of the supported languages).
* You have documented your configuration and your validation procedure in your report.

### Portainer

To manage the container docker, we decided to use Portainer.

[Source](https://linuxhint.com/install_portainer/)

Wee needed to do 3 things to be able to use Portainer:
 * Create a docker volume portainer_data
 * Run a container via the portainer image (the socket of the container and the host must to be connected). 
 * Go to the URL ```http://192.168.99.100:9090``` to use Portainer
 
For the 2 first things :
```
docker volume create portainer_data
docker run -d -p 9090:9000 -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer
```

After the third one, we arrive to a page where we can create a user if it is the first time we run the container with the volume. Otherwise it is a login page. We created a user : username *admin*, password *12341234*

Now we can manage our endpoints (can be local or on the web, type : docker, portainer agent, Azure. Didn't search a lot what it is exactly) and our containers