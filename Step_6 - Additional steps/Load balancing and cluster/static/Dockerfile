FROM php:7.3-apache

# Traefik configuration
LABEL "traefik.backend"="static"
LABEL "traefik.backend.loadbalancer.sticky"="false"
LABEL "traefik.frontend.rule"="PathPrefix: /"
LABEL "traefik.port"="80"

COPY src /var/www/html/