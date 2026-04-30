import { signOut } from "@project/auth";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { SESSION_TIMEOUT_ROUTE } from "@src/app/session-timeout/constants";
import setSignOutFlagCookie from "@src/utils/auth/setSignOutFlagCookie";
import { userLogout } from "@src/utils/auth/user-logout";
import { requestScopedStorageWrapper } from "@src/utils/requestScopedStorageWrapper";

jest.mock("@project/auth", () => ({
  signOut: jest.fn(),
}));
jest.mock("@src/utils/auth/setSignOutFlagCookie");
jest.mock("@src/utils/requestScopedStorageWrapper", () => ({
  requestScopedStorageWrapper: jest.fn((fn, ...args) => fn(...args)),
}));
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

  it("should setSignOutFlagCookie to prevent race condition with concurrent getSession calls", async () => {
    await userLogout(true);

    expect(setSignOutFlagCookie).toHaveBeenCalled();
  });

  it("should wrap logout flow in request scoped storage", async () => {
    await userLogout(true);

    expect(requestScopedStorageWrapper).toHaveBeenCalled();
  });
});
