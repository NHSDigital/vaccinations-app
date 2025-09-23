import { JSX } from "react";

interface ExpanderProps {
  title: string;
  component: JSX.Element;
  notExpandable?: boolean;
}

const Expander = (detailsProps: ExpanderProps) => {
  return detailsProps.notExpandable ? (
    <>
      <h3 dangerouslySetInnerHTML={{ __html: detailsProps.title }} />
      {detailsProps.component}
    </>
  ) : (
    <details className="nhsuk-details nhsuk-expander">
      <summary className="nhsuk-details__summary">
        <span className="nhsuk-details__summary-text">
          <div dangerouslySetInnerHTML={{ __html: detailsProps.title }} />
        </span>
      </summary>
      <div className="nhsuk-details__text">{detailsProps.component}</div>
    </details>
  );
};

export default Expander;
