import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import SSOFailure from "@src/app/sso-failure/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the context
jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("SSOFailure", () => {
  beforeAll(() => {
    mockNHSAppJSFunctions(jest.fn(), jest.fn(), jest.fn(), jest.fn(), jest.fn());
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
  });

  it("shows mobile app message when in mobile app and context is loaded", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: true,
    });

    render(<SSOFailure />);

    expect(screen.getByText(/Go back and try logging in again\./)).toBeInTheDocument();
    expect(screen.getByText(/If you cannot log in, try again later\./)).toBeInTheDocument();
  });

  it("shows browser message when not in mobile app and context is loaded", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: false,
    });

    render(<SSOFailure />);

    expect(screen.getByText(/Close this tab and try logging in again\./)).toBeInTheDocument();
    expect(screen.getByText(/If you cannot log in, try again later\./)).toBeInTheDocument();
  });
});
