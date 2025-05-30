interface Window {
  // Reference: https://nhsconnect.github.io/nhsapp-developer-documentation/js-v2-api-specification/
  nhsapp: {
    // tools functions are available within both native mobile and desktop app
    tools: {
      getAppPlatform: () => string;
      isOpenInNHSApp: () => boolean;
    };
    // navigation functions are only available within native mobile app
    navigation: {
      goToHomePage: () => void;
      openBrowserOverlay: (overlayUri: string) => void;
    };
  };
}
