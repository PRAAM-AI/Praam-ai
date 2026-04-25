FROM nginx:alpine

# Paths must match index.html (css/styles.css → @import ../styles.css, js/script.js).
COPY index.html /usr/share/nginx/html/index.html
COPY index-v1.html /usr/share/nginx/html/index-v1.html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY styles.css /usr/share/nginx/html/styles.css
COPY script.js /usr/share/nginx/html/script.js
COPY assets /usr/share/nginx/html/assets
COPY v2 /usr/share/nginx/html/v2

# Route / → /v2/ while keeping v1 available.
COPY nginx.conf /etc/nginx/conf.d/default.conf
