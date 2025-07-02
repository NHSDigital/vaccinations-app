import { unprotectedUrlPaths } from "@src/app/_components/inactivity/constants";
import { InactivityDialog } from "@src/app/_components/inactivity/InactivityDialog";
import { render, screen } from "@testing-library/react";
import { userLogout } from "@src/utils/auth/user-logout";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { Session } from "next-auth";

const mockSessionValue: Session = {
  expires: new Date(Date.now() + 60000).toISOString(),
  user: {
    nhs_number: "",
    birthdate: "",
    access_token: "",
    id_token: { jti: "" },
  },
};
let mockSession = { data: mockSessionValue, status: "authenticated" };

jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
}));

let mockUrlPath = "/";
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => mockUrlPath),
}));

jest.mock("@src/utils/auth/inactivity-timer");
jest.mock("@src/utils/auth/user-logout");

let idleSession = false;
let timedOutSession = false;

const setupJsdomWorkaroundForDialogElement = () => {
  // Dialog element is not support in JSDom: workaround from https://github.com/jsdom/jsdom/issues/3294
  HTMLDialogElement.prototype.show = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = true;
  });

  HTMLDialogElement.prototype.showModal = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = jest.fn(function mock(this: HTMLDialogElement) {
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
      mockUrlPath = "/";
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

      expect(userLogout).toHaveBeenCalledWith(true);
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
      expect(userLogout).toHaveBeenCalledWith(true);
    });

    it("should close the dialog when user clicks the stay logged in button", async () => {
      idleSession = true;

      render(<InactivityDialog />);
      screen.getByRole("button", { name: "Stay logged in" }).click();

      const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
    });

    it("should call logout when user clicks the button", async () => {
      idleSession = true;

      render(<InactivityDialog />);
      screen.getByRole("button", { name: "Log out" }).click();

      expect(userLogout).toHaveBeenCalledWith();
    });

    it.each(unprotectedUrlPaths)(
      "should not show warning dialog or logout user when on %s",
      async (urlPath: string) => {
        idleSession = true;
        mockUrlPath = urlPath;
        render(<InactivityDialog />);
        const inactivityWarningModal: HTMLElement = screen.getByRole("dialog", {
          hidden: true,
        });
        expect(inactivityWarningModal).not.toBeVisible();
        expect(userLogout).not.toHaveBeenCalled();
      },
    );
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      mockSession = { data: mockSessionValue, status: "unauthenticated" };
      idleSession = timedOutSession = false;
      mockUrlPath = "/";
    });

    it("should not show warning when user is idle", async () => {
      idleSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal = screen.queryByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
    });

    it.each(unprotectedUrlPaths)(
      "should not try to logout when user activity has timed out on %s",
      async (urlPath: string) => {
        idleSession = timedOutSession = true;
        mockUrlPath = urlPath;

        render(<InactivityDialog />);

        const inactivityWarningModal = screen.queryByRole("dialog", {
          hidden: true,
        });
        expect(inactivityWarningModal).not.toBeVisible();
        expect(userLogout).not.toHaveBeenCalled();
      },
    );

    it("should try to logout when user activity has timed out", async () => {
      idleSession = timedOutSession = true;

      render(<InactivityDialog />);

      const inactivityWarningModal = screen.queryByRole("dialog", {
        hidden: true,
      });
      expect(inactivityWarningModal).not.toBeVisible();
      expect(userLogout).toHaveBeenCalledWith(true);
    });
  });

  describe("when user goes from authenticated to unauthenticated", () => {
    beforeEach(() => {
      mockSession = { data: mockSessionValue, status: "authenticated" };
      idleSession = timedOutSession = false;
    });

    it("should try to log the user out", async () => {
      const { rerender } = render(<InactivityDialog />);
      expect(userLogout).not.toHaveBeenCalled();
      mockSession = { data: mockSessionValue, status: "unauthenticated" };
      rerender(<InactivityDialog />);
      expect(userLogout).toHaveBeenCalledWith(true);
    });
  });
});
