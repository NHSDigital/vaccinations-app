import SessionLogout from "@src/app/session-logout/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

describe("SessionLogout", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeEach(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should show NHS App home page inside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    render(<SessionLogout />);
    expect(mockGoToHomePage).toHaveBeenCalledTimes(1);
  });

  it("should show logged out page outside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(false);
    render(<SessionLogout />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "You have logged out",
    });
    expect(heading).toBeInTheDocument();
  });
});
