export const mockNHSAppJSFunctions = (
  mockIsOpenInNHSApp: jest.Mock,
  mockGoToHomePage?: jest.Mock,
  mockGoToPage?: jest.Mock,
  mockOpenBrowserOverlay?: jest.Mock,
) => {
  Object.defineProperty(window, "nhsapp", {
    value: {
      tools: { isOpenInNHSApp: mockIsOpenInNHSApp },
      navigation: {
        goToHomePage: mockGoToHomePage,
        goToPage: mockGoToPage,
        openBrowserOverlay: mockOpenBrowserOverlay,
        AppPage: {
          SERVICES: "services",
        },
      },
    },
    writable: true,
  });
};

describe("nhsapp-js", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();
  const mockGoToPage = jest.fn();

  beforeEach(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage, mockGoToPage);
  });

  it("should mock isOpenInNHSApp", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    expect(window.nhsapp.tools.isOpenInNHSApp()).toBeTruthy();
  });

  it("should mock goToHomePage", () => {
    window.nhsapp.navigation.goToHomePage();
    expect(mockGoToHomePage).toHaveBeenCalled();
  });

  it("should mock goToPage", () => {
    window.nhsapp.navigation.goToPage("test");
    expect(mockGoToPage).toHaveBeenCalledWith("test");
  });
});
