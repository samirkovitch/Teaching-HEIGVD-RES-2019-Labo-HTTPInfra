FROM php:7.3-apache

RUN apt-get update && apt-get install -y vim

COPY apache2-foreground /usr/local/bin/
COPY templates /var/apache2/templates

COPY src/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*