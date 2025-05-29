interface Window {
  nhsapp: {
    tools: {
      getAppPlatform: () => string;
      isOpenInNHSApp: () => boolean;
    },
    navigation: {
      goToHomePage: () => void;
      openBrowserOverlay: (overlayUri: string) => void;
    }
  }
}
