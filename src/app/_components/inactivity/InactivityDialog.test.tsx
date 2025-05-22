import InactivityDialog from "@src/app/_components/inactivity/InactivityDialog";
import { render, screen } from "@testing-library/react";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { Session } from "next-auth";

const mockSessionValue: Session = {
  expires: new Date(Date.now() + 60000).toISOString(),
  user: { nhs_number: "", birthdate: "" },
};
let mockSession = { data: mockSessionValue, status: "authenticated" };
const mockSignOut = jest.fn();

jest.mock("@src/utils/auth/inactivity-timer");

jest.mock("next-auth/react", () => {
  return {
    useSession: () => mockSession,
    signOut: mockSignOut
  };
});

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
    });

    it("should show warning when session is idle", async () => {
      idleSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog");
      expect(inactivityWarningModal).toBeVisible();
    });

    it("should not show warning when session is not idle", async () => {
      idleSession = false;

      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
    });

    it("should close dialog and extend session when user clicks to stay logged in", async () => {
      idleSession = true;
      timedOutSession = false;

      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).toBeVisible();

      const extendSessionButton = screen.getByTestId("extend-session-button")
      extendSessionButton.click();

      expect(inactivityWarningModal).not.toBeVisible();
      // todo: add missing assertion: how to assert the session extended / timeout was reset?...
    });

    it("should close dialog and call signOut when user clicks log out", async () => {
      idleSession = true;
      timedOutSession = false;

      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).toBeVisible();

      const logOutButton = screen.getByTestId("log-out-button")
      logOutButton.click();

      expect(inactivityWarningModal).not.toBeVisible();
      // TODO: get the mocking of the signout function working
      expect(mockSignOut).toHaveBeenCalled();
    });

    it("should call signOut when session is timed out", async () => {
      idleSession = true;
      timedOutSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      mockSession = { data: mockSessionValue, status: "unauthenticated" };
    });

    it("should not show warning when unauthenticated session is idle", async () => {
      idleSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal = screen.queryByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
    });
  });
});
