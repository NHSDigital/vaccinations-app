const NHS_APP_HOME_PAGE_URL = "https://www.nhsapp.service.nhs.uk/";

const toNHSAppHomePage = () => {
  if (window.nhsapp.tools.isOpenInNHSApp()) {
    window.nhsapp.navigation.goToHomePage();
  } else {
    window.location.href = NHS_APP_HOME_PAGE_URL;
  }
};

export { toNHSAppHomePage };
