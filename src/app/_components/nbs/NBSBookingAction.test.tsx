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
    const renderAndClickNBSBookingActionForVaccine = (displayText: string, renderAs: "anchor" | "button") => {
      render(
        <NBSBookingActionForVaccine
          vaccineType={VaccineType.RSV}
          displayText={displayText}
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );
      let bookingAction;
      if (renderAs === "anchor") {
        bookingAction = screen.getByRole("link", { name: displayText });
      } else {
        bookingAction = screen.getByRole("button", { name: displayText });
      }
      bookingAction.click();
    };

    it("should open NBS SSO link in same window when action is clicked within NHS app", async () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });

      // render as button
      renderAndClickNBSBookingActionForVaccine("test", "button");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForVaccine("test", "anchor");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");
    });

    it("should open NBS SSO link in new window when action is clicked outside NHS app", async () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });

      // render as button
      renderAndClickNBSBookingActionForVaccine("test", "button");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForVaccine("test", "anchor");
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");
    });

    it("given browser context has not loaded, should do nothing when action is clicked", async () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: undefined,
      });

      // render as button
      renderAndClickNBSBookingActionForVaccine("test", "button");
      expect(window.open).not.toHaveBeenCalled();

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForVaccine("test", "anchor");
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  describe("Given base URL", () => {
    const url = randomURL();

    const renderAndClickNBSBookingActionForBaseUrl = (displayText: string, renderAs: "anchor" | "button") => {
      render(
        <NBSBookingActionForBaseUrl
          url={url.href}
          displayText={displayText}
          renderAs={renderAs}
          reduceBottomPadding={false}
        />,
      );
      let bookingAction;
      if (renderAs === "anchor") {
        bookingAction = screen.getByRole("link", { name: displayText });
      } else {
        bookingAction = screen.getByRole("button", { name: displayText });
      }
      bookingAction.click();
    };

    it("should open NBS SSO link in same window when action is clicked within NHS app", async () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: true,
      });

      // render as button
      renderAndClickNBSBookingActionForBaseUrl("test", "button");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForBaseUrl("test", "anchor");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");
    });

    it("should open NBS SSO link in new window when action is clicked outside NHS app", async () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: true,
        isOpenInMobileApp: false,
      });

      // render as button
      renderAndClickNBSBookingActionForBaseUrl("test", "button");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForBaseUrl("test", "anchor");
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");
    });

    it("given browser context has not loaded, should do nothing when action is clicked", async () => {
      (useBrowserContext as jest.Mock).mockReturnValue({
        hasContextLoaded: false,
        isOpenInMobileApp: undefined,
      });

      // render as button
      renderAndClickNBSBookingActionForBaseUrl("test", "button");
      expect(window.open).not.toHaveBeenCalled();

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForBaseUrl("test", "anchor");
      expect(window.open).not.toHaveBeenCalled();
    });
  });
});
