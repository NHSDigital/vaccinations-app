import { toNHSAppHomePage } from "@src/utils/navigation";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";

describe("toNHSAppHomePage", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeEach(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should navigate to NHS App home page when inside NHS App", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    toNHSAppHomePage();
    expect(mockGoToHomePage).toHaveBeenCalled();
  });
  // JSDom is not able to handle window.location assignments, and hence
  // currently not possible to test the desktop scenario.
  // Reference: https://github.com/jsdom/jsdom/issues/3492
});
