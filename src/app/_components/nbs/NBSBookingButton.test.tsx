import { jest } from "@jest/globals";
import { NBSBookingButton } from "@src/app/_components/nbs/NBSBookingButton";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";
import { VaccineTypes } from "@src/models/vaccine";

const mockIsOpenInNHSApp = jest.fn();

describe("NBSBookingButton", () => {
  beforeAll(() => {
    // Mock window.nhsapp.tools and window.open
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, jest.fn());
    window.open = jest.fn() as never;
  });

  const renderAndClickNBSBookingButton = () => {
    render(<NBSBookingButton vaccineType={VaccineTypes.RSV} />);
    const bookingButton = screen.getByRole("button", {
      name: "Continue to booking",
    });
    bookingButton.click();
  };

  it("should open NBS SSO link in same window when button is clicked within NHS app", async () => {
    mockIsOpenInNHSApp.mockImplementation(() => true);
    renderAndClickNBSBookingButton();

    expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/api/sso-to-nbs?vaccine=rsv",
      "_self",
    );
  });

  it("should open NBS SSO link in new window when button is clicked outside NHS app", async () => {
    mockIsOpenInNHSApp.mockImplementation(() => false);
    renderAndClickNBSBookingButton();

    expect(mockIsOpenInNHSApp).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/api/sso-to-nbs?vaccine=rsv",
      "_blank",
    );
  });
});
