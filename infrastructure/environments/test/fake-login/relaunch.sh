#!/usr/bin/env zsh

docker stop local-fake-login || true

pub_key_base64=$(grep -v -- '-----' public_key.pem | base64 -w0)

for f in ./*-realm.template.json; do sed "s#REPLACE_WITH_BASE64_ENCODED_PUBLIC_KEY#$pub_key_base64#g" "$f" > "${f/.template.json/.json}"; done

docker build --no-cache -t fake-login . # For local testing

docker run -d --rm -p 3001:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin --name local-fake-login fake-login start-dev --import-realm --log-level=debug
