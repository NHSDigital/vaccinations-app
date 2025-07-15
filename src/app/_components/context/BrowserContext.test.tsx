import { BrowserContextProvider, useBrowserContext } from "@src/app/_components/context/BrowserContext";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock component to consume the context
const TestComponent = () => {
  const { hasContextLoaded, isOpenInMobileApp } = useBrowserContext();
  return (
    <div>
      <div data-testid="hasContextLoaded">{hasContextLoaded ? "true" : "false"}</div>
      <div data-testid="isOpenInMobileApp">{isOpenInMobileApp ? "true" : "false"}</div>
    </div>
  );
};

const mockIsOpenInNHSApp = jest.fn();

describe("BrowserContextProvider", () => {
  beforeAll(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp);
  });

  it("sets context correctly when inside NHS app", async () => {
    mockIsOpenInNHSApp.mockReturnValue(true);

    render(
      <BrowserContextProvider>
        <TestComponent />
      </BrowserContextProvider>,
    );

    expect(screen.getByTestId("hasContextLoaded").textContent).toBe("true");
    expect(screen.getByTestId("isOpenInMobileApp").textContent).toBe("true");
  });

  it("sets context correctly when NOT inside NHS app", async () => {
    mockIsOpenInNHSApp.mockReturnValue(false);

    render(
      <BrowserContextProvider>
        <TestComponent />
      </BrowserContextProvider>,
    );

    expect(screen.getByTestId("hasContextLoaded").textContent).toBe("true");
    expect(screen.getByTestId("isOpenInMobileApp").textContent).toBe("false");
  });
});
