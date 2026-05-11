FROM nginx:alpine

# Paths must match index.html (css/styles.css → @import ../styles.css; js/script.js).
COPY index.html /usr/share/nginx/html/index.html
COPY services.html industries.html about.html contact.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY styles.css /usr/share/nginx/html/styles.css
COPY assets /usr/share/nginx/html/assets
COPY v2 /usr/share/nginx/html/v2

COPY nginx.conf /etc/nginx/conf.d/default.conf
