interface Window {
  // Reference: https://nhsconnect.github.io/nhsapp-developer-documentation/js-v2-api-specification/
  nhsapp: {
    // tools functions are available within both native mobile and desktop app
    tools: {
      isOpenInNHSApp: () => boolean;
    };
    // navigation functions are only available within native mobile app
    navigation: {
      AppPage: AppPageEnums;
      goToPage: (nhsAppPage: string) => void;
      goToHomePage: () => void;
      openBrowserOverlay: (overlayUri: string) => void;
      setBackAction: (backAction: function) => void;
    };
  };
}

type AppPageEnums = {
  SERVICES: string;
};
