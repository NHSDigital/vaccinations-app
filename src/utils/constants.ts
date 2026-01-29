import { SERVICE_FAILURE_ROUTE } from "@src/app/service-failure/constants";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { SSO_FAILURE_ROUTE } from "@src/app/sso-failure/constants";

export const AWS_PRIMARY_REGION = "eu-west-2";

export enum ClientSideErrorTypes {
  UNHANDLED_ERROR = "UNHANDLED_ERROR",
  UNHANDLED_PROMISE_REJECT_ERROR = "UNHANDLED_PROMISE_REJECT_ERROR",
  UNHANDLED_ERROR_DURING_RENDER = "UNHANDLED_ERROR_DURING_RENDER",
  UNKNOWN_ERROR_REASON = "UNKNOWN_ERROR_REASON",
}

export enum ClientSidePageviewTypes {
  SESSION_LOGOUT_PAGEVIEW = "SESSION_LOGOUT_PAGEVIEW",
  SESSION_TIMEOUT_PAGEVIEW = "SESSION_TIMEOUT_PAGEVIEW",
  SSO_FAILURE_PAGEVIEW = "SSO_FAILURE_PAGEVIEW",
  SERVICE_FAILURE_PAGEVIEW = "SERVICE_FAILURE_PAGEVIEW",
}

export const PageviewTypeUrls: Record<ClientSidePageviewTypes, string> = {
  [ClientSidePageviewTypes.SESSION_LOGOUT_PAGEVIEW]: SESSION_LOGOUT_ROUTE,
  [ClientSidePageviewTypes.SERVICE_FAILURE_PAGEVIEW]: SERVICE_FAILURE_ROUTE,
  [ClientSidePageviewTypes.SSO_FAILURE_PAGEVIEW]: SSO_FAILURE_ROUTE,
  [ClientSidePageviewTypes.SESSION_TIMEOUT_PAGEVIEW]: SESSION_TIMEOUT_ROUTE,
};

export const SESSION_ID_COOKIE_NAME = "__Host-Http-session-id";
