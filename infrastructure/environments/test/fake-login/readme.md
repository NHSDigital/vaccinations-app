# Fake NHS Login for performance testing

```sh
docker build -t fake-login .

docker run -d -p 3001:3001 \
--name local-fake-login \
-e CLIENT_ID="vita-app-sandpit" \
-e CLIENT_SECRET="dummy-key" \
-e REDIRECT_URIS="http://localhost:3000/check-and-book-rsv" \
--rm \
fake-login

docker logs local-fake-login

docker stop local-fake-login
```
