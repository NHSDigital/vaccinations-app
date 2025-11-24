import { BrowserContextProvider } from "@src/app/_components/context/BrowserContext";
import SessionLogout from "@src/app/session-logout/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

describe("SessionLogout", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should show NHS App home page in the NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    render(
      <BrowserContextProvider>
        <SessionLogout />
      </BrowserContextProvider>,
    );
    const loggedOutText = screen.queryByText("You have logged out");
    expect(loggedOutText).not.toBeInTheDocument();
    expect(mockGoToHomePage).toHaveBeenCalledTimes(1);
  });

  it("should show logged out page in the browser", () => {
    mockIsOpenInNHSApp.mockReturnValue(false);
    render(
      <BrowserContextProvider>
        <SessionLogout />
      </BrowserContextProvider>,
    );
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "You have logged out",
    });
    expect(heading).toBeVisible();
  });
});
