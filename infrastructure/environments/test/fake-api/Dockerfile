FROM openresty/openresty:alpine
RUN apk add --no-cache gettext
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY data /usr/share/nginx/html/data/
EXPOSE 9123
CMD ["/bin/sh", "-c", " \
  export LOGIN_ROOT_URL=${LOGIN_ROOT_URL:-'http://localhost:9123'} && \
  export ELID_DELAY_SECONDS=${ELID_DELAY_SECONDS:-0} && \
  export APIM_DELAY_SECONDS=${APIM_DELAY_SECONDS:-0} && \
  envsubst '$LOGIN_ROOT_URL $ELID_DELAY_SECONDS $APIM_DELAY_SECONDS' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && \
  nginx -g 'daemon off;' \
"]
