import LinksInterceptor from "@src/app/_components/interceptor/LinksInterceptor";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

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
        <a data-testid={"external-a"} onClick={mockClickHandler} href={externalLink}>
          test
        </a>
        <a data-testid={"internal-a"} onClick={mockClickHandler} href={internalLink}>
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
    });

    it("should call openBrowserOverlay for external links", () => {
      renderLinksInterceptor();
      screen.getByTestId("external-a").click();
      expect(mockOpenBrowserOverlay).toHaveBeenCalledWith(externalLink);
      expect(mockClickHandler).not.toHaveBeenCalled();
    });

    it("should not call openBrowserOverlay for internal links", () => {
      renderLinksInterceptor();
      screen.getByTestId("internal-a").click();
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
    });

    it("should not call openBrowserOverlay for external links", () => {
      renderLinksInterceptor();
      screen.getByTestId("external-a").click();
      expect(mockOpenBrowserOverlay).not.toHaveBeenCalled();
      expect(mockClickHandler).toHaveBeenCalled();
    });
  });
});
