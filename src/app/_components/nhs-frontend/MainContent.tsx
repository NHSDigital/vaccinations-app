import React, { JSX } from "react";

const MainContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element => {
  return (
    <main className="nhsuk-main-wrapper nhsuk-main-wrapper--s" id="maincontent">
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-full">{children}</div>
      </div>
    </main>
  );
};

export default MainContent;
