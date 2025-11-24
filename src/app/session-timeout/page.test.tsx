import { BrowserContextProvider } from "@src/app/_components/context/BrowserContext";
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
    render(
      <BrowserContextProvider>
        <SessionTimeout />
      </BrowserContextProvider>,
    );

    const loggedOutText = screen.queryByText("You have been logged out");
    expect(loggedOutText).not.toBeInTheDocument();
    expect(mockGoToHomePage).toHaveBeenCalledTimes(1);
  });

  it("should show timeout out page in the browser", () => {
    mockIsOpenInNHSApp.mockReturnValue(false);
    render(
      <BrowserContextProvider>
        <SessionTimeout />
      </BrowserContextProvider>,
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "You have been logged out",
    });

    expect(heading).toBeVisible();
  });
});
