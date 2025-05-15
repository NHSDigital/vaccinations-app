import { Header } from "nhsuk-react-components";
import React from "react";

const AppHeader = () => {
  return (
    <Header transactional>
      <Header.Container>
        <Header.Logo href="/" />
        <Header.ServiceName href="/">
          Vaccinations in the app
        </Header.ServiceName>
      </Header.Container>
    </Header>
  );
};

export default AppHeader;
