FROM --platform=linux/amd64 nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY json/ /usr/share/nginx/html/json/
EXPOSE 9123
