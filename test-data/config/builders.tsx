import { AppConfig } from "@src/utils/config";
import { createTypeBuilder, randomString, randomInteger } from "@test-data/meta-builder";

export function appConfigBuilder() {
  return createTypeBuilder<AppConfig>({
    CONTENT_API_ENDPOINT: randomString(10),
    ELIGIBILITY_API_ENDPOINT: randomString(10),
    CONTENT_API_KEY: randomString(10),
    ELIGIBILITY_API_KEY: randomString(10),
    CONTENT_CACHE_PATH: randomString(10),
    NHS_LOGIN_URL: randomString(10),
    NHS_LOGIN_CLIENT_ID: randomString(10),
    NHS_LOGIN_SCOPE: randomString(10),
    NHS_LOGIN_PRIVATE_KEY: randomString(10),
    NBS_URL: randomString(10),
    NBS_BOOKING_PATH: randomString(10),
    MAX_SESSION_AGE_MINUTES: randomInteger(1, 999),
  });
}
