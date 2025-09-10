# Fake NHS Login using Keycloak

## Build & test image

```sh
docker build --no-cache -t fake-login . # For local testing

docker run -d --rm -p 3001:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin --name local-fake-login fake-login start-dev --import-realm

docker logs local-fake-login | less +G

docker stop local-fake-login

docker build --no-cache --platform linux/amd64 -t fake-login . # For AWS
```

In `.env.local`, you want:

```sh
NHS_LOGIN_URL=http://localhost:3001
NHS_APP_REDIRECT_LOGIN_URL=http://localhost:3001/realms/nhs-login-fake
```

* [Start point for /](http://localhost:3001/realms/nhs-login-fake/protocol/openid-connect/auth?client_id=vita-app-sandpit&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2F&scope=openid%20profile&response_type=code)
* [Start point for /check-and-book-rsv](http://localhost:3001/realms/nhs-login-fake/protocol/openid-connect/auth?client_id=vita-app-sandpit&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fcheck-and-book-rsv&scope=openid%20profile&response_type=code)
* [Start point for /api/auth/session](http://localhost:3001/realms/nhs-login-fake/protocol/openid-connect/auth?client_id=vita-app-sandpit&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fsession&scope=openid%20profile&response_type=code)
* [Start point for /api/sso](http://localhost:3001/realms/nhs-login-fake/protocol/openid-connect/auth?client_id=vita-app-sandpit&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fsso&scope=openid%20profile&response_type=code)
