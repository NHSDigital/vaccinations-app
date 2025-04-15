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

export const getAuthConfig = async (): Promise<AuthConfig> => {
  if (!config) {
    config = await configProvider();
  }

  return {
    url: config.VACCINATION_APP_URL,
    audience: config.VACCINATION_APP_URL,
    client_id: config.NHS_LOGIN_CLIENT_ID,
    scope: config.NHS_LOGIN_SCOPE,
    redirect_uri: `${config.VACCINATION_APP_URL}/auth/callback`,
    response_type: "code",
    grant_type: "authorization_code",
    post_login_route: `${config.VACCINATION_APP_URL}`,
  };
};
