import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import AppHeader from "@src/app/_components/nhs-frontend/AppHeader";
import { SERVICE_HEADING } from "@src/app/constants";
import { userLogout } from "@src/utils/auth/user-logout";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

const mockIsOpenInNHSApp = jest.fn();
const mockGoToHomePage = jest.fn();
let mockSession = {};
jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));
jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
}));
jest.mock("@src/utils/auth/user-logout", () => ({
  userLogout: jest.fn(),
}));

const expectHeaderVisible = (expectedVisible: boolean) => {
  const serviceLink: HTMLElement | null = screen.queryByText(SERVICE_HEADING);
  const logo: HTMLElement | null = screen.queryByRole("img", { name: "NHS" });

  if (expectedVisible) {
    expect(serviceLink).toBeVisible();
    expect(logo).toBeVisible();
  } else {
    expect(serviceLink).not.toBeInTheDocument();
    expect(logo).not.toBeInTheDocument();
  }
};

describe("AppHeader", () => {
  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  describe("when rendered in desktop browser", () => {
    beforeEach(() => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });
    });

    describe("when authenticated", () => {
      beforeEach(() => {
        mockSession = { status: "authenticated" };
      });

      it("shows the app header with logout link", async () => {
        render(<AppHeader />);
        expectHeaderVisible(true);
        const logoutLink: HTMLElement = screen.getByRole("link", { name: "Log out" });
        expect(logoutLink).toBeVisible();
        expect(logoutLink?.getAttribute("href")).toEqual("#");
      });

      it("logo and service name should link to service homepage", async () => {
        render(<AppHeader />);

        const logoAndServiceLink: HTMLElement = screen.getByRole("link", {
          name: `NHS ${SERVICE_HEADING} homepage`,
        });

        expect(logoAndServiceLink?.getAttribute("href")).toEqual("/check-and-book-vaccinations");
      });

      it("logs out on click", async () => {
        render(<AppHeader />);
        screen.getByRole("link", { name: "Log out" }).click();
        expect(userLogout).toHaveBeenCalled();
      });
    });

    describe("when unauthenticated", () => {
      beforeEach(() => {
        mockSession = { status: "unauthenticated" };
      });

      it("shows the app header without logout link", async () => {
        mockSession = { status: "unauthenticated" };
        render(<AppHeader />);
        expectHeaderVisible(true);
        const logoutLink: HTMLElement | null = screen.queryByRole("link", { name: "Log out" });
        expect(logoutLink).not.toBeInTheDocument();
      });

      it("should not include link destination for logo and service name", async () => {
        mockSession = { status: "unauthenticated" };
        render(<AppHeader />);

        const logoAndServiceLink: HTMLElement = screen.getByRole("link", {
          name: `NHS ${SERVICE_HEADING} homepage`,
        });

        expect(logoAndServiceLink.getAttribute("href")).toEqual("#");
      });
    });
  });

  describe("when rendered in mobile app", () => {
    beforeAll(() => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });
      render(<AppHeader />);
    });

    it("hides the app header", async () => {
      expectHeaderVisible(false);
    });
  });

  describe("when context has not loaded", () => {
    beforeAll(() => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: undefined,
      });
      render(<AppHeader />);
    });

    it("hides the app header", async () => {
      expectHeaderVisible(false);
    });
  });
});
