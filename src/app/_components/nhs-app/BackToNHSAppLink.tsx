"use client";

import { useEffect, useState } from "react";

const handleClick = () => {
  const servicesPage = window.nhsapp.navigation.AppPage.SERVICES;
  window.nhsapp.navigation.goToPage(servicesPage);
};

const BackToNHSAppLink = () => {
  const [isOpenInNHSApp, setIsOpenInNHSApp] = useState(false);

  useEffect(() => {
    if (window.nhsapp.tools.isOpenInNHSApp()) {
      setIsOpenInNHSApp(true);
    } else {
      setIsOpenInNHSApp(false);
    }
  }, []);

  if (!isOpenInNHSApp) return null;

  return (
    <div className="nhsuk-back-link">
      <a href="#" onClick={handleClick} className="nhsuk-back-link__link">
        <svg
          className="nhsuk-icon nhsuk-icon__chevron-left"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          height="24"
          width="24"
        >
          <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
        </svg>
        Back
      </a>
    </div>
  );
};

export default BackToNHSAppLink;
