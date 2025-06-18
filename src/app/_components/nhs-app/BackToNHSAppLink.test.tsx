import BackToNHSAppLink from "@src/app/_components/nhs-app/BackToNHSAppLink";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

describe("BackToNHSAppLink", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();
  const mockGoToPage = jest.fn();

  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage, mockGoToPage);
  });

  describe("when inside NHS App", () => {
    beforeEach(() => {
      mockIsOpenInNHSApp.mockReturnValue(true);
    });

    it("clicking back link takes user to NHS app services page", async () => {
      render(<BackToNHSAppLink />);
      const backLink = screen.queryByRole("link", { name: "Back" });
      expect(backLink).toBeVisible();
      backLink?.click();
      expect(mockIsOpenInNHSApp).toHaveBeenCalled();
      expect(mockGoToPage).toHaveBeenCalledWith("services");
    });
  });

  describe("when inside the browser", () => {
    beforeEach(() => {
      mockIsOpenInNHSApp.mockReturnValue(false);
    });

    it("back link is not rendered", async () => {
      render(<BackToNHSAppLink />);
      const backLink = screen.queryByRole("link", { name: "Back" });
      expect(backLink).toBeNull();
    });
  });
});
