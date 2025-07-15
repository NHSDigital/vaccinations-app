import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import ServiceFailure from "@src/app/service-failure/page";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the context
jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("ServiceFailure", () => {
  beforeAll(() => {
    mockNHSAppJSFunctions(jest.fn());
  });

  it("renders the title and static content", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: false,
      isOpenInMobileApp: false,
    });

    render(<ServiceFailure />);

    expect(screen.getByText("There is a problem with the service")).toBeInTheDocument();
    expect(screen.getByText("This maybe a temporary problem.")).toBeInTheDocument();
    expect(screen.queryByText(/If you cannot login, try again later\./)).not.toBeInTheDocument();
  });

  it("shows mobile app message when in mobile app and context is loaded", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: true,
    });

    render(<ServiceFailure />);

    expect(screen.getByText(/Go back and try logging in again\./)).toBeInTheDocument();
    expect(screen.getByText(/If you cannot login, try again later\./)).toBeInTheDocument();
  });

  it("shows browser message when not in mobile app and context is loaded", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: false,
    });

    render(<ServiceFailure />);

    expect(screen.getByText(/Close this tab and try logging in again\./)).toBeInTheDocument();
    expect(screen.getByText(/If you cannot login, try again later\./)).toBeInTheDocument();
  });
});
