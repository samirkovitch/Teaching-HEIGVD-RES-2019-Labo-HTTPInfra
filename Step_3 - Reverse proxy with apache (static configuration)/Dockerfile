FROM php:5.6-apache

RUN apt-get update && apt-get install -y vim

COPY src /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*