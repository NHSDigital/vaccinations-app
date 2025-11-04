"use client";

import { Footer } from "nhsuk-react-components";
import React from "react";

// Ref: https://main--65aa76b29d00a047fe683b95.chromatic.com/?path=/docs/navigation-footer--docs
const AppFooter = () => {
  return (
    <Footer>
      <Footer.Meta>
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
        <Footer.Copyright />
      </Footer.Meta>
    </Footer>
  );
};

export default AppFooter;
