import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import LinksInterceptor from "@src/app/_components/interceptor/LinksInterceptor";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("LinksInterceptor", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockOpenBrowserOverlay = jest.fn();
  const externalLink = "https://external.link/?q=xyz#abc";
  const internalLink = "/internal?q=xyz#abc";
  const mockClickHandler = jest.fn();

  const renderLinksInterceptor = () => {
    render(
      <>
        <div data-testid={"div"}>test</div>
        <a data-testid={"external-link"} onClick={mockClickHandler} href={externalLink}>
          test
        </a>
        <a data-testid={"internal-link"} onClick={mockClickHandler} href={internalLink}>
          test
        </a>
        <LinksInterceptor />
      </>,
    );
  };

  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, undefined, undefined, mockOpenBrowserOverlay);
  });

  describe("when in NHS app", () => {
    beforeAll(() => {
      mockIsOpenInNHSApp.mockReturnValue(true);
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });
    });

    it("should call openBrowserOverlay for external links", () => {
      renderLinksInterceptor();
      screen.getByTestId("external-link").click();
      expect(mockOpenBrowserOverlay).toHaveBeenCalledWith(externalLink);
      expect(mockClickHandler).not.toHaveBeenCalled();
    });

    it("should not call openBrowserOverlay for internal links", () => {
      renderLinksInterceptor();
      screen.getByTestId("internal-link").click();
      expect(mockOpenBrowserOverlay).not.toHaveBeenCalled();
      expect(mockClickHandler).toHaveBeenCalled();
    });

    it("should not call openBrowserOverlay for other clicks", () => {
      renderLinksInterceptor();
      screen.getByTestId("div").click();
      expect(mockOpenBrowserOverlay).not.toHaveBeenCalled();
      expect(mockClickHandler).not.toHaveBeenCalled();
    });
  });

  describe("when in browser", () => {
    beforeAll(() => {
      mockIsOpenInNHSApp.mockReturnValue(false);
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });
    });

    it("should not call openBrowserOverlay for external links", () => {
      renderLinksInterceptor();
      screen.getByTestId("external-link").click();
      expect(mockOpenBrowserOverlay).not.toHaveBeenCalled();
      expect(mockClickHandler).toHaveBeenCalled();
    });
  });

  describe("when context has not loaded", () => {
    it("should never open browser overlay", async () => {
      mockIsOpenInNHSApp.mockReturnValue(true);
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: true,
      });
      renderLinksInterceptor();
      screen.getByTestId("external-link").click();
      expect(mockOpenBrowserOverlay).not.toHaveBeenCalled();
      expect(mockClickHandler).toHaveBeenCalled();
    });
  });
});
