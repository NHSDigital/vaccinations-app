import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { userLogout } from "@src/utils/auth/user-logout";
import { signOut } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn()
}));

describe("user-logout", () => {
  it("should call signOut with correct parameters", async () => {
    userLogout();

    expect(signOut).toHaveBeenCalledWith({
      redirect: true,
      redirectTo: SESSION_LOGOUT_ROUTE
    });
  });
});
