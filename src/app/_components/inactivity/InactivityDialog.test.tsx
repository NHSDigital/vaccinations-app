import { InactivityDialog } from "@src/app/_components/inactivity/InactivityDialog";
import { SESSION_LOGOUT_ROUTE } from "@src/app/session-logout/constants";
import { userExtendSession } from "@src/utils/auth/user-extend-session";
import { render, screen } from "@testing-library/react";
import { userLogout } from "@src/utils/auth/user-logout";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { Session } from "next-auth";

const mockSessionValue: Session = {
  expires: new Date(Date.now() + 60000).toISOString(),
  user: { nhs_number: "", birthdate: "", access_token: "" },
};
let mockSession = { data: mockSessionValue, status: "authenticated" };

jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
}));

jest.mock("@src/utils/auth/inactivity-timer");
jest.mock("@src/utils/auth/user-logout");
jest.mock("@src/utils/auth/user-extend-session");

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

let idleSession = false;
let timedOutSession = false;

const setupJsdomWorkaroundForDialogElement = () => {
  // Dialog element is not support in JSDom: workaround from https://github.com/jsdom/jsdom/issues/3294
  HTMLDialogElement.prototype.show = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });

  HTMLDialogElement.prototype.showModal = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = false;
  });
};

describe("InactivityDialog", () => {
  beforeAll(() => {
    (useInactivityTimer as jest.Mock).mockImplementation(() => {
      return { isIdle: idleSession, isTimedOut: timedOutSession };
    });

    setupJsdomWorkaroundForDialogElement();
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      mockSession = { data: mockSessionValue, status: "authenticated" };
      idleSession = timedOutSession = false;
    });

    it("should show warning when user is idle", async () => {
      idleSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog");
      expect(inactivityWarningModal).toBeVisible();
    });

    it("should not show warning when user is not idle", async () => {
      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
    });

    it("should try to logout when user activity has timed out", async () => {
      idleSession = timedOutSession = true;

      render(<InactivityDialog />);

      expect(userLogout).toHaveBeenCalledTimes(1);
    });

    it("should not show warning when user activity has timed out after warning", async () => {
      idleSession = true;

      const { rerender } = render(<InactivityDialog />);
      timedOutSession = true;
      rerender(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
      expect(userLogout).toHaveBeenCalledTimes(1);
    });

    it("should call extend session when user clicks the button", async () => {
      idleSession = true;

      render(<InactivityDialog />);
      screen.getByRole("button", { name: "Stay logged in" }).click();

      expect(userExtendSession).toHaveBeenCalledTimes(1);
    });

    it("should call logout when user clicks the button", async () => {
      idleSession = true;

      render(<InactivityDialog />);
      screen.getByRole("button", { name: "Log out" }).click();

      expect(userLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      mockSession = { data: mockSessionValue, status: "unauthenticated" };
      idleSession = timedOutSession = false;
    });

    it("should redirect to session logout page", async () => {
      render(<InactivityDialog />);
      expect(mockRouterPush).toHaveBeenCalledWith(SESSION_LOGOUT_ROUTE);
    });

    it("should not show warning when user is idle", async () => {
      idleSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal = screen.queryByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
    });

    it("should not try to logout when user activity has timed out", async () => {
      idleSession = timedOutSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal = screen.queryByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
      expect(userLogout).not.toHaveBeenCalled();
    });
  });
});
