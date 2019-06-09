# Step 5: Dynamic reverse proxy configuration

### Acceptance criteria

* You have a GitHub repo with everything needed to build the various images.
* You have found a way to replace the static configuration of the reverse proxy (hard-coded IP adresses) with a dynamic configuration.
* You may use the approach presented in the webcast (environment variables and PHP script executed when the reverse proxy container is started), or you may use another approach. The requirement is that you should not have to rebuild the reverse proxy Docker image when the IP addresses of the servers change.
* You are able to do an end-to-end demo with a well-prepared scenario. Make sure that you can demonstrate that everything works fine when the IP addresses change!
* You are able to explain how you have implemented the solution and walk us through the configuration and the code.
* You have **documented** your configuration in your report.

## Implenmentation with a PHP script

The dynamic reverse proxy is implemented with a PHP script. We need to pass the IP addresses of the static and dynamic app in the docker command

### PHP Script

This script (in templates/) permits to get back the 2 IP (DYNAMIC_APP and STATIC_APP) passed as env variables  with ```docker -e``` and create a conf file for the reverse proxy (see *apache2-foreground* for more infos)
```
<?php
   $dynamic_app = getenv('DYNAMIC_APP');
   $static_app = getenv('STATIC_APP');
?>
<VirtualHost *:80>
    ServerName labo-http.res.ch

    ProxyPass '/api/dates/' 'http://<?php print "$dynamic_app"?>/'
    ProxyPassReverse "/api/dates/" "http://<?php print "$dynamic_app"?>/'

    ProxyPass '/' 'http://<?php print "$static_app"?>/'
    ProxyPassReverse '/' 'http://<?php print "$static_app"?>/'
</VirtualHost>
``` 

### apache2-foreground

We use apache 7.3. So to modify the start script of apache, we need to copy it. Here is the origin : ```https://github.com/docker-library/php/blob/master/7.3/stretch/apache/apache2-foreground```. 

We add the following code on the top just after ```set -e```:
```
# Add setup for RES HTTP-infra lab
echo "Setup for RES HTTP-infra lab..."
echo "Static app URL: $STATIC_APP"
echo "Dynamic app URL: $DYNAMIC_APP"
php /var/apache2/templates/config-template.php > /etc/apache2/sites-available/001-reverse-proxy.conf
```

The second and third lines display the IP addresses of the static and dynamic app. the last one execute the PHP script and copy the result in /etc/apache2/sites-available/001-reverse-proxy.conf. This file (001-reverse-proxy.conf) is the conf file of the reverse proxy

**apache2-foreground must to be in UNIX format. If it is not, use NotePad++ to change its format**

## Procedure for demo 

**Need the containers of previous steps**

*The step 3 (static reverse proxy) src/ has been copied in src/ (only for default configuration)*

Build the image of the dynamic reverse proxy : ```docker build -t res/apache_rp_dynamic .``` 

Run 3 times ```docker run -d res/apache_php``` to create 3 static web site containers without a name and one with a name ```docker run -d --name apache_static res/apache_php```

Same with the dynamic web site but instead of 3, only run 2 times without a name : ```docker run -d res/express```, and with a name : ```docker run -d --name express_dynamic res/express```

Search the IP addresses of named containers with ```docker inspect CONTAINER_NAME | grep -i "ip"```
 - apache_static   : ```172.17.0.5```
 - express_dynamic : ```172.17.0.8```

Run a dynamic reverse proxy container with those IP addresses ```docker run -d -e STATIC_APP=172.17.0.5:80 -e DYNAMIC_APP=172.17.0.8:3000 --name apache_rp -p 8080:80 res/apache_rp_dynamic```

Write this URL ```http://labo-http.res.ch:8080/``` to see if it's working
