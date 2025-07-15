import { jest } from "@jest/globals";
import { NBSBookingActionForBaseUrl, NBSBookingActionForVaccine } from "@src/app/_components/nbs/NBSBookingAction";
import { VaccineTypes } from "@src/models/vaccine";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { randomURL } from "@test-data/meta-builder";
import { render, screen } from "@testing-library/react";

const mockIsOpenInNHSApp = jest.fn();

describe("NBSBookingAction", () => {
  beforeAll(() => {
    // Mock window.nhsapp.tools and window.open
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, jest.fn());
    window.open = jest.fn() as never;
  });

  describe("Given vaccine type", () => {
    const renderAndClickNBSBookingActionForVaccine = (displayText: string, renderAs: "anchor" | "button") => {
      render(
        <NBSBookingActionForVaccine vaccineType={VaccineTypes.RSV} displayText={displayText} renderAs={renderAs} />,
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
      mockIsOpenInNHSApp.mockImplementation(() => true);

      // render as button
      renderAndClickNBSBookingActionForVaccine("test", "button");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForVaccine("test", "anchor");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");
    });

    it("should open NBS SSO link in new window when action is clicked outside NHS app", async () => {
      mockIsOpenInNHSApp.mockImplementation(() => false);

      // render as button
      renderAndClickNBSBookingActionForVaccine("test", "button");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForVaccine("test", "anchor");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");
    });
  });

  describe("Given base URL", () => {
    const url = randomURL();

    const renderAndClickNBSBookingActionForBaseUrl = (displayText: string, renderAs: "anchor" | "button") => {
      render(<NBSBookingActionForBaseUrl url={url.href} displayText={displayText} renderAs={renderAs} />);
      let bookingAction;
      if (renderAs === "anchor") {
        bookingAction = screen.getByRole("link", { name: displayText });
      } else {
        bookingAction = screen.getByRole("button", { name: displayText });
      }
      bookingAction.click();
    };

    it("should open NBS SSO link in same window when action is clicked within NHS app", async () => {
      mockIsOpenInNHSApp.mockImplementation(() => true);

      // render as button
      renderAndClickNBSBookingActionForBaseUrl("test", "button");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForBaseUrl("test", "anchor");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_self");
    });

    it("should open NBS SSO link in new window when action is clicked outside NHS app", async () => {
      mockIsOpenInNHSApp.mockImplementation(() => false);

      // render as button
      renderAndClickNBSBookingActionForBaseUrl("test", "button");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");

      jest.clearAllMocks();

      // render as anchor
      renderAndClickNBSBookingActionForBaseUrl("test", "anchor");
      expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(`/api/sso-to-nbs?redirectTarget=${url.href}`, "_blank");
    });
  });
});
