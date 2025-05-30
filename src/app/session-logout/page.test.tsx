import SessionLogout from "@src/app/session-logout/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

describe("SessionLogout", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeEach(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should show mobile version inside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    render(<SessionLogout />);
    const mobileButton = screen.getByRole("button", { name: "Log back in" });
    expect(mobileButton).toBeInTheDocument();
  });

  it("should show desktop version outside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(false);
    render(<SessionLogout />);
    const desktopButton = screen.getByRole("button", { name: "Continue" });
    expect(desktopButton).toBeInTheDocument();
  });
});
