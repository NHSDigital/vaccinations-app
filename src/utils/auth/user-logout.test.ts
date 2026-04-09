import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import { userLogout } from "@src/utils/auth/user-logout";
import { signOut } from "next-auth/react";
import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));
jest.mock("@src/utils/auth/setSignOutFlagCookie");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("user-logout", () => {
  it("should call signOut to be redirected to logout page by default", async () => {
    await userLogout();

    expect(signOut).toHaveBeenCalledWith({
      redirect: true,
      redirectTo: SESSION_LOGOUT_ROUTE,
    });
  });

  it("should call signOut to be redirected to timeout page given reason", async () => {
    await userLogout(true);

    expect(signOut).toHaveBeenCalledWith({
      redirect: true,
      redirectTo: SESSION_TIMEOUT_ROUTE,
    });
  });

  it("should setSignOutFlagCookie to prevent race condition with concurrent getSession calls", async() => {
    await userLogout(true);

    expect(setSignOutFlagCookie).toHaveBeenCalled();
  });
});
