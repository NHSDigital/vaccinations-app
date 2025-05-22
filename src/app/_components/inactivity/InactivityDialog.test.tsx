import InactivityDialog from "@src/app/_components/inactivity/InactivityDialog";
import { render, screen } from "@testing-library/react";
import useInactivityTimer from "@src/utils/auth/inactivity-timer";
import { Session } from "next-auth";

const mockSessionValue: Session = {
  expires: new Date(Date.now() + 60000).toISOString(),
  user: { nhs_number: "", birthdate: "" },
};
let mockSession = { data: mockSessionValue, status: "authenticated" };

jest.mock("@src/utils/auth/inactivity-timer");

jest.mock("next-auth/react", () => {
  return {
    useSession: () => mockSession,
  };
});

let idleSession = false;
const timedOutSession = false;

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
