import { jest } from "@jest/globals";
import { NBSBookingAction } from "@src/app/_components/nbs/NBSBookingAction";
import { VaccineTypes } from "@src/models/vaccine";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

const mockIsOpenInNHSApp = jest.fn();

describe("NBSBookingAction", () => {
  beforeAll(() => {
    // Mock window.nhsapp.tools and window.open
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, jest.fn());
    window.open = jest.fn() as never;
  });

  const renderAndClickNBSBookingAction = (displayText: string, renderAs: "anchor" | "button") => {
    render(<NBSBookingAction vaccineType={VaccineTypes.RSV} displayText={displayText} renderAs={renderAs} />);
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
    renderAndClickNBSBookingAction("test", "button");
    expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");

    jest.clearAllMocks();

    // render as anchor
    renderAndClickNBSBookingAction("test", "anchor");
    expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_self");
  });

  it("should open NBS SSO link in new window when action is clicked outside NHS app", async () => {
    mockIsOpenInNHSApp.mockImplementation(() => false);

    // render as button
    renderAndClickNBSBookingAction("test", "button");
    expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");

    jest.clearAllMocks();

    // render as anchor
    renderAndClickNBSBookingAction("test", "anchor");
    expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/api/sso-to-nbs?vaccine=rsv", "_blank");
  });
});
