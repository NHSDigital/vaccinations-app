import { SERVICE_FAILURE_ROUTE } from "@src/app/service-failure/constants";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";

export const unprotectedUrlPaths: string[] = [
  SESSION_LOGOUT_ROUTE,
  SESSION_TIMEOUT_ROUTE,
  SSO_FAILURE_ROUTE,
  SERVICE_FAILURE_ROUTE,
];
