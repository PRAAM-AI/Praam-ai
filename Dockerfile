FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY services.html industries.html about.html contact.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets
COPY v3 /usr/share/nginx/html/v3

COPY nginx.conf /etc/nginx/conf.d/default.conf
