# Step 2: Dynamic HTTP server with express.js

### Acceptance criteria

* You have a GitHub repo with everything needed to build the Docker image.
* You can do a demo, where you build the image, run a container and access content from a browser.
* You generate dynamic, random content and return a JSON payload to the client.
* You cannot return the same content as the webcast (you cannot return a list of people).
* You don't have to use express.js; if you want, you can use another JavaScript web framework or event another language.
* You have **documented** your configuration in your report.

### Procedure for demo

In the Dockerfile, there is 3 commands: 
 * one for the origin of the container (FROM php:5.6-apache)
 * one for copy the files in the container (COPY src/ /var/www/html/)
 * one to execute the spript js when the container started (CMD ["node", "/opt/app/index.js"])

The script js returns a random date with a hour as JSON payload to the client.

To create a new docker image, write the command ```docker buid -t res/express .```. 

To run a docker container, write the command ```docker run res/express```. If we want to connect with telnet, we need a port mapping ```-p 9090:3000``` and the command will be ```telnet 192.168.99.100 9090``` 