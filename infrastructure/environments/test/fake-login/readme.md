# Fake NHS Login for performance testing

```sh
docker build -t fake-nhs-login-service .

docker run -d -p 3001:3001 \
--name my-fake-nhs-login \
-e CLIENT_ID="my-perf-test-app" \
-e CLIENT_SECRET="a-very-secret-secret" \
-e REDIRECT_URIS="http://host.docker.internal:8080/auth/callback" \
--rm \
fake-nhs-login-service
```

* `-d`: Run in detached (background) mode.
* `-p 3001:3001`: Map port 3001 on your machine to port 3001 in the container.
* `--name`: Give the container a convenient name.
* `-e ...`: Override the default environment variables to match your test application's configuration.
    * **Note on `host.docker.internal`**: If your web application is *also* running in a Docker container, this special DNS name allows it to connect back to services running on the host machine. If your app is running directly on your machine (not in a container), you would use `http://localhost:8080/auth/callback`.
* `--rm`: Automatically remove the container when it stops.
