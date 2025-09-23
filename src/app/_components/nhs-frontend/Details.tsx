import { JSX } from "react";

interface DetailsProps {
  title: string;
  component: JSX.Element;
}

const Details = (detailsProps: DetailsProps): JSX.Element => {
  return (
    <details className="nhsuk-details">
      <summary className="nhsuk-details__summary">
        <span className="nhsuk-details__summary-text">
          <div dangerouslySetInnerHTML={{ __html: detailsProps.title }} />
        </span>
      </summary>
      <div className="nhsuk-details__text">{detailsProps.component}</div>
    </details>
  );
};

export default Details;
