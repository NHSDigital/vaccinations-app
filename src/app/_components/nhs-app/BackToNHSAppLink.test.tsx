import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

import clearAllMocks = jest.clearAllMocks;

jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("BackToNHSAppLink", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToPage = jest.fn();
  const mockSetBackAction = jest.fn();

  beforeAll(() => {
    clearAllMocks();
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, jest.fn(), mockGoToPage, jest.fn(), mockSetBackAction);
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
      const backLink: HTMLElement = screen.getByRole("link", { name: "Back" });
      expect(backLink).toBeVisible();
      backLink?.click();
      expect(mockGoToPage).toHaveBeenCalledWith("services");
    });

    it("back action is set", async () => {
      render(<BackToNHSAppLink />);
      expect(mockSetBackAction).toHaveBeenCalledTimes(1);
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
      const backLink: HTMLElement | null = screen.queryByRole("link", { name: "Back" });
      expect(backLink).not.toBeInTheDocument();
    });

    it("back action is not set", async () => {
      render(<BackToNHSAppLink />);
      expect(mockSetBackAction).not.toHaveBeenCalled();
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
