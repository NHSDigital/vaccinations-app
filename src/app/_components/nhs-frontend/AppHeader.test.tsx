import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import AppHeader from "@src/app/_components/nhs-frontend/AppHeader";
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

const testHeader = (expectedVisible: boolean) => {
  const serviceLink = screen.queryByRole("link", {
    name: "Check and book an RSV vaccination",
  });
  const logoLink = screen.queryByRole("link", { name: "NHS homepage" });
  if (expectedVisible) {
    expect(serviceLink).toBeVisible();
    expect(serviceLink?.getAttribute("href")).toEqual("/check-and-book-rsv");
    expect(logoLink).toBeVisible();
    expect(logoLink?.getAttribute("href")).toEqual("/check-and-book-rsv");
  } else {
    expect(serviceLink).toBeNull();
    expect(logoLink).toBeNull();
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

    it("shows the app header with logout link when authenticated", async () => {
      mockSession = { status: "authenticated" };
      render(<AppHeader />);
      testHeader(true);
      const logoutLink = screen.getByRole("link", { name: "Log out" });
      expect(logoutLink).toBeVisible();
      expect(logoutLink?.getAttribute("href")).toEqual("#");
    });

    it("shows the app header without logout link when unauthenticated", async () => {
      mockSession = { status: "unauthenticated" };
      render(<AppHeader />);
      testHeader(true);
      const logoutLink = screen.queryByRole("link", { name: "Log out" });
      expect(logoutLink).toBeNull();
    });

    it("logs out on click", async () => {
      mockSession = { status: "authenticated" };
      render(<AppHeader />);
      screen.getByRole("link", { name: "Log out" }).click();
      expect(userLogout).toHaveBeenCalled();
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
      testHeader(false);
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
      testHeader(false);
    });
  });
});
