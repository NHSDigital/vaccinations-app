import { toNHSAppHomePage } from "@src/utils/navigation";

describe("toNHSAppHomePage", () => {
  let mockIsOpenInNHSApp: () => boolean;
  let mockGoToHomePage: () => void;

  beforeEach(() => {
    mockIsOpenInNHSApp = jest.fn();
    mockGoToHomePage = jest.fn();

    Object.defineProperty(window, "nhsapp", {
      value: {
        tools: { isOpenInNHSApp: mockIsOpenInNHSApp },
        navigation: { goToHomePage: mockGoToHomePage },
      },
      writable: true,
    });
  });

  it("should navigate to NHS App home page when inside NHS App", () => {
    (mockIsOpenInNHSApp as jest.Mock).mockReturnValue(true);
    toNHSAppHomePage();
    expect(mockGoToHomePage).toHaveBeenCalled();
  });
  // JSDom is not able to handle window.location assignments, and hence
  // currently not possible to test the desktop scenario.
  // Reference: https://github.com/jsdom/jsdom/issues/3492
});
