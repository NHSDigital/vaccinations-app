"use client";

import React from "react";

// Ref: https://service-manual.nhs.uk/design-system/components/skip-link
const SkipLink = () => {
  return (
    <a
      className="nhsuk-skip-link"
      href="#maincontent"
      data-testid="skip-link"
      onClick={(event) => {
        event.preventDefault();
        const contentTitle = document.getElementsByTagName("h1").item(0);
        contentTitle?.setAttribute("tabindex", "-1");
        contentTitle?.focus();
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
