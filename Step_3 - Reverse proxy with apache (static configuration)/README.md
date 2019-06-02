# Step 3: Reverse proxy with apache (static configuration)

### Acceptance criteria

* You have a GitHub repo with everything needed to build the Docker image for the container.
* You can do a demo, where you start from an "empty" Docker environment (no container running) and where you start 3 containers: static server, dynamic server and reverse proxy; in the demo, you prove that the routing is done correctly by the reverse proxy.
* You can explain and prove that the static and dynamic servers cannot be reached directly (reverse proxy is a single entry point in the infra). 
* You are able to explain why the static configuration is fragile and needs to be improved.
* You have **documented** your configuration in your report.

## Start and check the 2 server containers

**Need the containers of previous steps**

```docker run -d --name apache_static res/apache_php```

```docker run -d --name express_dynamic res/express```

-> The containers are started without the port mapping. So we don't have access to them directly 

```docker inspect apache_static | grep -i ipaddress```

IP found: 172.17.0.2

Port: 80

```docker inspect express_dynamic | grep -i ipaddress```

IP found: 172.17.0.3

Port: 3000

*Go inside docker-machine:* docker-machine ssh

### Test for apache_static inside docker-machine

```
telnet 172.17.0.3 80 
GET / HTTP/1.0
```

### Test for express_dynamic inside docker-machine

```
telnet 172.17.0.3 3000
GET / HTTP/1.0
```

## Config the proxy

In the folder "src", there are 2 files:
 * src\sites-available\000-default.config
 * src\sites-available\001-reverse-proxy.config
 
The first one is there to not allow to connect with the server's ip directly. The second one configures the 2 proxies.

### 000-default.cong
```
<VirtualHost *:80>
</VirtualHost>
```
If we try to connect to the Web sites with the IP, we will be redirect to a error page
### 001-reverse-proxy.conf
```
<VirtualHost *:80>
    ServerName labo-http.res.ch

    ProxyPass "/api/dates/" "http://172.17.0.3:3000/"
    ProxyPassReverse "/api/dates/" "http://172.17.0.3:3000/"

    ProxyPass "/" "http://172.17.0.2:80/"
    ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>
```
We can access to the first Web site with the URL ```labo-http.res.ch:PORT``` and to the second with ```labo-http.res.ch:PORT/api/dates/```
## Test the proxy

 * Create the image: docker build -t res/apache_rp_static .
 * Run the container: docker run -p 9090:80 res/apache_rp_static
 * Test to connect with the ip: 192.168.99.100:9090 (the result need to be a error message)
 * Test to connect with a writin request: 
 
 ``` 
telnet 192.168.99.100 9090    
GET /api/dates/ HTTP/1.0    
Host: labo_http.res.ch
```

## Configure the DNS (Windows)

Add a new host in the file C:\Windows\System32\drivers\etc\hosts ```192.168.99.100	labo-http.res.ch```