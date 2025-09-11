import { logger } from "@src/utils/logger";

const log = logger.child({ name: "fake-login" });

const token = {
  access_token: "fake-login-access-token",
  refresh_token: "fake-login-refresh-token",
  token_type: "Bearer",
  expires_in: 3600,
  id_token:
    "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJzdWIiOiIxOTQ3NjQ5Zi0wODJhLTRiYWYtYjkyYi1jZGQyMDNhZTAyODgiLCJhdWQiOiJ2aXRhLWFwcC1zYW5kcGl0IiwiaWF0IjoxNzU3NTE4MTAxLCJ2dG0iOiJodHRwOi8vbG9jYWxob3N0OjgwODEvdHJ1c3RtYXJrL2xvY2FsaG9zdDo4MDgxIiwiYXV0aF90aW1lIjoxNzU3NTE4MDk3LCJ2b3QiOiJQOS5DcC5DZCIsImV4cCI6NDkxMzE5NjQyMiwianRpIjoiOTMzODI5NDktNTVkMy00NDUyLTkyMDUtYjRkZjcxOGE5YzgyIiwibmhzX251bWJlciI6Ijk2ODYzNjg5NzMiLCJpZGVudGl0eV9wcm9vZmluZ19sZXZlbCI6IlA5IiwiaWRfc3RhdHVzIjoidmVyaWZpZWQiLCJ0b2tlbl91c2UiOiJpZCIsInN1cm5hbWUiOiJNSUxMQVIiLCJmYW1pbHlfbmFtZSI6Ik1JTExBUiIsImJpcnRoZGF0ZSI6IjE5NjgtMTItMDIifQ.fH-z6hEs2ITwvHrCHFHjcL5D2HC9moNpRVQ6JwnhdQSq5VY2tNqZBk1cRfDvAxmFbzqGlFii6QuNnQ5vYM_NuUN48P04XE034LnVt41b-spi4qUZTneENhmuCtt1JDtc-tpEFDwRSvuDneNUhN5jMlgrcECfY3e8DvShy6smpHvC7VZkYQn4xkQ_ygLB3hv8v1T9V8rm671e8njEjK3ACjchPnEgM3o28I24p82-vZsH69QNVGeLEQXmNZPSP-M1LWK4zEgKz4Zs98u3IiHQzbd8IQohEuNkmNiLSauohU9ZSiFUiLLeH6rgRb4gJYvFRakwzaUkav3M5Bb9DuR-YA",
};

export const POST = async () => {
  log.info("token endpoint called");
  return Response.json(token);
};
