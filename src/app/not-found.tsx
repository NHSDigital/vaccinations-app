import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";

const NotFound = () => {
  return (
    <>
      <title>{`Page not found - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackLink />
      <MainContent>
        <h1>Page not found</h1>
        <p>We&#39;ll fix this link as soon as possible. Try again later or use a different service.</p>
        <p>
          For urgent medical advice, go to{" "}
          <a href={"https://111.nhs.uk/"} target={"_blank"} rel={"noopener"}>
            111.nhs.uk
          </a>{" "}
          or call 111.
        </p>
      </MainContent>
    </>
  );
};

export default NotFound;
