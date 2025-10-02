"use client";

import { Footer } from "nhsuk-react-components";
import React from "react";

const AppFooter = () => {
  return (
    <Footer>
      <Footer.List>
        <Footer.ListItem
          href="https://www.nhs.uk/nhs-app/nhs-app-help-and-support/vaccinations/check-and-book-an-rsv-vaccination"
          target={"_blank"}
        >
          Help and support
        </Footer.ListItem>
        <Footer.ListItem href="/our-policies/cookies-policy">Cookies</Footer.ListItem>
        <Footer.ListItem
          href="https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/"
          target={"_blank"}
        >
          Privacy policy
        </Footer.ListItem>
        <Footer.ListItem href="/our-policies/accessibility">Accessibility statement</Footer.ListItem>
      </Footer.List>
      <Footer.Copyright>© Crown copyright</Footer.Copyright>
    </Footer>
  );
};

export default AppFooter;
