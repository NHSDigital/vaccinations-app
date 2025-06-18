import SessionTimeout from "@src/app/session-timeout/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

describe("SessionTimeout", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should show NHS App home page in the NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    render(<SessionTimeout />);

    const loggedOutText = screen.queryByText("You have been logged out");
    expect(loggedOutText).toBeNull();
    expect(mockGoToHomePage).toHaveBeenCalledTimes(1);
  });

  it("should show timeout out page in the browser", () => {
    mockIsOpenInNHSApp.mockReturnValue(false);
    render(<SessionTimeout />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "You have been logged out",
    });

    expect(heading).toBeVisible();
  });
});
