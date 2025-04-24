import { AppConfig, configProvider } from "@src/utils/config";

type AuthConfig = {
  url: string;
  audience: string;
  client_id: string;
  scope: string;
  redirect_uri: string;
  response_type: string;
  grant_type: string;
  post_login_route: string;
};
let config: AppConfig;

const getAuthConfig = async (): Promise<AuthConfig> => {
  if (!config) {
    config = await configProvider();
  }

  // TODO: VIA-87 2025-04-17 Check how to get URL of deployed lambda and replace
  const vitaUrl = process.env.VACCINATION_APP_URL || "not-yet-implemented";

  return {
    url: config.NHS_LOGIN_URL,
    audience: vitaUrl,
    client_id: config.NHS_LOGIN_CLIENT_ID,
    scope: config.NHS_LOGIN_SCOPE,
    redirect_uri: `${vitaUrl}/auth/callback`,
    response_type: "code",
    grant_type: "authorization_code",
    post_login_route: `${vitaUrl}`,
  };
};

export { getAuthConfig };
