# Step 1: Static HTTP server with apache httpd

### Acceptance criteria

* You have a GitHub repo with everything needed to build the Docker image.
* You can do a demo, where you build the image, run a container and access content from a browser.
* You have used a nice looking web template, different from the one shown in the webcast.
* You are able to explain what you do in the Dockerfile.
* You are able to show where the apache config files are located (in a running container).
* You have **documented** your configuration in your report.

### Procedure for demo

In the Dockerfile, there is 2 commands: 
 * one for the origin of the container (FROM php:5.6-apache) 
 * one for copy the files in the container (COPY src/ /var/www/html/)

To create a new docker image, write the command ```docker buid -t res/apache2 .```

To run a docker container, write the command ```docker run -p 9090:80 res/apache2```. Add a ```-d``` if you want to run background.

To go inside of the container, write the command ```docker exec -it ID_CONT /bin/bash```

If the container runs in background, the logs can be seen with ```docker logs COND_ID```

To see if the server is working, I wrote in a browser ```192.168.99.100:9090``` and I have to see my Web page

In /var, there is the web site's content

In /etc/apache2/sites-available/000-default.conf, there is the default VirtualHost. You can give the path of the web site's sources with DocumentRoot (put the same path in the Dockerfile)