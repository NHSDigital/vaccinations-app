import SessionTimeout from "@src/app/session-timeout/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

describe("SessionTimeout", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeEach(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should show NHS App home page inside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    render(<SessionTimeout />);
    expect(mockGoToHomePage).toHaveBeenCalledTimes(1);
  });

  it("should show timeout out page outside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(false);
    render(<SessionTimeout />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "You have been logged out",
    });
    expect(heading).toBeInTheDocument();
  });
});
