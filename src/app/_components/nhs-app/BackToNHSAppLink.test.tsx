import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("BackToNHSAppLink", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();
  const mockGoToPage = jest.fn();

  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage, mockGoToPage);
  });

  describe("when inside mobile app", () => {
    beforeEach(() => {
      mockIsOpenInNHSApp.mockReturnValue(true);
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });
    });

    it("clicking back link takes user to NHS app services page", async () => {
      render(<BackToNHSAppLink />);
      const backLink = screen.queryByRole("link", { name: "Back" });
      expect(backLink).toBeVisible();
      backLink?.click();
      expect(mockGoToPage).toHaveBeenCalledWith("services");
    });
  });

  describe("when inside the browser", () => {
    beforeEach(() => {
      mockIsOpenInNHSApp.mockReturnValue(false);
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });
    });

    it("back link is not rendered", async () => {
      render(<BackToNHSAppLink />);
      const backLink = screen.queryByRole("link", { name: "Back" });
      expect(backLink).toBeNull();
    });
  });

  describe("when browser context has not loaded", () => {
    beforeEach(() => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: undefined,
      });
    });

    it("the back link is not shown", async () => {
      render(<BackToNHSAppLink />);
      const backLink = screen.queryByRole("link", { name: "Back" });
      expect(backLink).toBeNull();
    });
  });
});
