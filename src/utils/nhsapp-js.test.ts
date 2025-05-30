export const mockNHSAppJSFunctions = (
  mockIsOpenInNHSApp: jest.Mock,
  mockGoToHomePage: jest.Mock,
) => {
  Object.defineProperty(window, "nhsapp", {
    value: {
      tools: { isOpenInNHSApp: mockIsOpenInNHSApp },
      navigation: { goToHomePage: mockGoToHomePage },
    },
    writable: true,
  });
};

describe("nhsapp-js", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockGoToHomePage = jest.fn();

  beforeEach(() => {
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, mockGoToHomePage);
  });

  it("should mock isOpenInNHSApp", () => {
    mockIsOpenInNHSApp.mockReturnValue(true);
    expect(window.nhsapp.tools.isOpenInNHSApp()).toBeTruthy();
  });

  it("should mock goToHomePage", () => {
    window.nhsapp.navigation.goToHomePage();
    expect(mockGoToHomePage).toHaveBeenCalled();
  });
});
