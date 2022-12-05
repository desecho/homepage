# https://hub.docker.com/_/nginx
FROM nginx:1.23.2-alpine

COPY src /usr/share/nginx/html
