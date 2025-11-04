import { IdAndHeading } from "@src/app/our-policies/cookies-policy/page";
import React, { JSX } from "react";

const ChangesPage = (props: IdAndHeading): JSX.Element => {
  return (
    <>
      <h2 id={props.id}>{props.heading}</h2>
      <p>
        Our cookie policy may change. The latest version of our cookie policy will be accessible through this service.
        We will inform you if we make any material changes to our cookies policy or privacy notice. This will allow you
        to refresh your consent if you wish to continue using this service.
      </p>
    </>
  );
};

export { ChangesPage };
