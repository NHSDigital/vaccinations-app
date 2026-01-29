import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import SSOFailure from "@src/app/sso-failure/page";
import logClientSidePageview from "@src/utils/client-side-logger-server-actions/client-side-pageview-logger";
import { ClientSidePageviewTypes } from "@src/utils/constants";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the context
jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/client-side-logger-server-actions/client-side-pageview-logger");
let mockLogClientSidePageview: jest.MockedFunction<(clientSidePageviewType: ClientSidePageviewTypes) => Promise<void>>;

describe("SSOFailure", () => {
  beforeAll(() => {
    mockNHSAppJSFunctions(jest.fn(), jest.fn(), jest.fn(), jest.fn(), jest.fn());
    mockLogClientSidePageview = (logClientSidePageview as jest.Mock).mockResolvedValue(Promise.resolve());
  });

  it("renders the title and static content", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: false,
      isOpenInMobileApp: false,
    });

    render(<SSOFailure />);

    expect(screen.getByText("There is a problem")).toBeInTheDocument();
    expect(screen.getByText("There was an issue with NHS login. This may be a temporary problem.")).toBeInTheDocument();
    expect(screen.queryByText(/If you cannot log in, try again later\./)).not.toBeInTheDocument();
    expect(mockLogClientSidePageview).toHaveBeenCalledWith(ClientSidePageviewTypes.SSO_FAILURE_PAGEVIEW);
  });

  it("shows mobile app message when in mobile app and context is loaded", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: true,
    });

    render(<SSOFailure />);

    expect(screen.getByText(/Go back and try logging in again\./)).toBeInTheDocument();
    expect(screen.getByText(/If you cannot log in, try again later\./)).toBeInTheDocument();
    expect(mockLogClientSidePageview).toHaveBeenCalledWith(ClientSidePageviewTypes.SSO_FAILURE_PAGEVIEW);
  });

  it("shows browser message when not in mobile app and context is loaded", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: false,
    });

    render(<SSOFailure />);

    expect(screen.getByText(/Close this tab and try logging in again\./)).toBeInTheDocument();
    expect(screen.getByText(/If you cannot log in, try again later\./)).toBeInTheDocument();
    expect(mockLogClientSidePageview).toHaveBeenCalledWith(ClientSidePageviewTypes.SSO_FAILURE_PAGEVIEW);
  });
});
