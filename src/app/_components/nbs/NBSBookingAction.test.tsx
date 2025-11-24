import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { NBSBookingActionForBaseUrl, NBSBookingActionForVaccine } from "@src/app/_components/nbs/NBSBookingAction";
import { VaccineType } from "@src/models/vaccine";
import { randomURL } from "@test-data/meta-builder";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("NBSBookingAction", () => {
  beforeAll(() => {
    window.open = jest.fn() as never;
  });

  describe("Given vaccine type", () => {
    const renderAndClickNBSBookingAction = (
      displayText: string,
      renderAs: "anchor" | "button" | "actionLink",
      whichElement: number = 0,
    ): HTMLElement => {
      render(
        <NBSBookingActionForVaccine
          vaccineType={VaccineType.RSV}
          displayText={displayText}
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );

      const role: "button" | "link" = renderAs === "button" ? "button" : "link"; // "anchor" and "actionLink" are both links

      const element: HTMLElement = screen.getAllByRole(role, { name: displayText })[whichElement];
      expect(element).toBeVisible();
      element.click();

      return element;
    };

    it("should open NBS SSO link in same window when action is clicked within NHS app", () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });

      // render as button
      renderAndClickNBSBookingAction("test", "button");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");

      // render as anchor
      renderAndClickNBSBookingAction("test", "anchor");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");

      // render as action link
      renderAndClickNBSBookingAction("test", "actionLink", 1);
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");
    });

    it("should open NBS SSO link in new window when action is clicked outside NHS app", () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });

      // render as button
      renderAndClickNBSBookingAction("test", "button");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");

      // render as anchor
      renderAndClickNBSBookingAction("test", "anchor");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");

      // render as action link
      renderAndClickNBSBookingAction("test", "actionLink", 1);
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");
    });

    it("given browser context has not loaded, should do nothing when action is clicked", () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: undefined,
      });

      // render as button
      renderAndClickNBSBookingAction("test", "button");
      expect(window.open).not.toHaveBeenCalled();

      // render as anchor
      renderAndClickNBSBookingAction("test", "anchor");
      expect(window.open).not.toHaveBeenCalled();

      // render as action link
      renderAndClickNBSBookingAction("test", "actionLink", 1);
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  describe("Given base URL", () => {
    const url = randomURL();

    const renderAndClickNBSBookingAction = (
      displayText: string,
      renderAs: "anchor" | "button" | "actionLink",
      whichElement: number = 0,
    ): HTMLElement => {
      render(
        <NBSBookingActionForBaseUrl
          url={url.href}
          displayText={displayText}
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );

      const role: "button" | "link" = renderAs === "button" ? "button" : "link"; // "anchor" and "actionLink" are both links

      const element: HTMLElement = screen.getAllByRole(role, { name: displayText })[whichElement];
      element.click();

      return element;
    };

    it("should open NBS SSO link in same window when action is clicked within NHS app", () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });

      // render as button
      renderAndClickNBSBookingAction("test", "button");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");

      // render as anchor
      renderAndClickNBSBookingAction("test", "anchor");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");

      // render as action link
      renderAndClickNBSBookingAction("test", "actionLink", 1);
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");
    });

    it("should open NBS SSO link in new window when action is clicked outside NHS app", () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });

      // render as button
      renderAndClickNBSBookingAction("test", "button");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");

      // render as anchor
      renderAndClickNBSBookingAction("test", "anchor");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");

      // render as action link
      renderAndClickNBSBookingAction("test", "actionLink", 1);
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");
    });

    it("given browser context has not loaded, should do nothing when action is clicked", () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: undefined,
      });

      // render as button
      renderAndClickNBSBookingAction("test", "button");
      expect(window.open).not.toHaveBeenCalled();

      // render as anchor
      renderAndClickNBSBookingAction("test", "anchor");
      expect(window.open).not.toHaveBeenCalled();

      // render as action link
      renderAndClickNBSBookingAction("test", "actionLink", 1);
      expect(window.open).not.toHaveBeenCalled();
    });
  });
});
