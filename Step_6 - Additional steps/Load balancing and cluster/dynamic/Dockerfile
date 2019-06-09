FROM node:latest

# Traefik configuration
LABEL "traefik.backend"="dynamic"
LABEL "traefik.backend.loadbalancer.sticky"="true"
LABEL "traefik.frontend.rule"="PathPrefixStrip: /api/dates/"
LABEL "traefik.port"="80"

COPY src/ /opt/app
WORKDIR /opt/app
RUN npm install

CMD ["node", "/opt/app/index.js"]