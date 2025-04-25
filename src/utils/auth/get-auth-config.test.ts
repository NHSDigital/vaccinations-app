import { configProvider } from "@src/utils/config";
import { getAuthConfig } from "@src/utils/auth/get-auth-config";

jest.mock("@src/utils/config");

const mockNhsLoginUrl = "nhs-login/url";
const mockNhsLoginScope = "openid profile";
const mockNhsLoginClientId = "vita-client-id";
const mockVaccinationAppUrl = "vita-base-url";

(configProvider as jest.Mock).mockImplementation(() => ({
  NHS_LOGIN_URL: mockNhsLoginUrl,
  NHS_LOGIN_CLIENT_ID: mockNhsLoginClientId,
  NHS_LOGIN_SCOPE: mockNhsLoginScope,
}));

describe("getAuthConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("is constructed with values from configProvider", async () => {
    jest.replaceProperty(process, "env", {
      ...process.env,
      VACCINATION_APP_URL: mockVaccinationAppUrl,
    });
    const expectedAuthConfig = {
      url: mockNhsLoginUrl,
      audience: mockVaccinationAppUrl,
      client_id: mockNhsLoginClientId,
      scope: mockNhsLoginScope,
      redirect_uri: `${mockVaccinationAppUrl}/api/auth/callback`,
      response_type: "code",
      grant_type: "authorization_code",
      post_login_route: `${mockVaccinationAppUrl}`,
    };

    const authConfig = await getAuthConfig();

    expect(authConfig).toEqual(expectedAuthConfig);
  });
});
