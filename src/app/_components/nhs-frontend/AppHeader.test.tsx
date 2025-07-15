import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import AppHeader from "@src/app/_components/nhs-frontend/AppHeader";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

const mockIsOpenInNHSApp = jest.fn();
const mockGoToHomePage = jest.fn();
jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
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
    beforeAll(() => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });
      render(<AppHeader />);
    });

    it("shows the app header", async () => {
      testHeader(true);
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
