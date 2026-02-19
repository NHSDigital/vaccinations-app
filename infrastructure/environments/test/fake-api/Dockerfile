FROM openresty/openresty:alpine

RUN apk add --no-cache gettext python3 py3-pip
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip config set global.trusted-host \
    "pypi.org files.pythonhosted.org pypi.python.org" \
    --trusted-host=pypi.python.org \
    --trusted-host=pypi.org \
    --trusted-host=files.pythonhosted.org
RUN pip install flask gunicorn
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY data /usr/share/nginx/html/data/
COPY token_server.py /app/token_server.py

COPY --chmod=0755 <<EOF /entrypoint.sh
#!/bin/sh
set -e

export LOGIN_ROOT_URL=\${LOGIN_ROOT_URL:-'http://localhost:9123'}
export APP_ROOT_URL=\${APP_ROOT_URL:-'https://localhost:3000'}
export NBS_URL=\${NBS_URL:-'http://localhost:9123/nbs'}
export ELID_DELAY_SECONDS=\${ELID_DELAY_SECONDS:-0}
export APIM_DELAY_SECONDS=\${APIM_DELAY_SECONDS:-0}

envsubst '\$LOGIN_ROOT_URL \$APP_ROOT_URL \$NBS_URL \$ELID_DELAY_SECONDS \$APIM_DELAY_SECONDS' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

cd /app
exec gunicorn --workers 3 --bind 0.0.0.0:5000 token_server:app &

exec "\$@"
EOF

EXPOSE 9123 5000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
