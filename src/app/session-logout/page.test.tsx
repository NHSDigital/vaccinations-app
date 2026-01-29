import { BrowserContextProvider } from "@src/app/_components/context/BrowserContext";
import SessionLogout from "@src/app/session-logout/page";
import logClientSidePageview from "@src/utils/client-side-logger-server-actions/client-side-pageview-logger";
import { ClientSidePageviewTypes } from "@src/utils/constants";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/client-side-logger-server-actions/client-side-pageview-logger");
let mockLogClientSidePageview: jest.MockedFunction<(clientSidePageviewType: ClientSidePageviewTypes) => Promise<void>>;

describe("SessionLogout", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
    mockLogClientSidePageview = (logClientSidePageview as jest.Mock).mockResolvedValue(Promise.resolve());
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
    expect(mockLogClientSidePageview).not.toHaveBeenCalled();
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
    expect(mockLogClientSidePageview).toHaveBeenCalledWith(ClientSidePageviewTypes.SESSION_LOGOUT_PAGEVIEW);
  });
});
