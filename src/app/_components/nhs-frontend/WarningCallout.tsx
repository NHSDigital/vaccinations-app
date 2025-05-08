import { JSX } from "react";

interface WarningCalloutProps {
  heading: JSX.Element;
  content: JSX.Element;
}

const WarningCallout = ({ heading, content }: WarningCalloutProps) => {
  return (
    <div className="nhsuk-warning-callout">
      <h3 className="nhsuk-warning-callout__label">
        <span role="text">
          <span className="nhsuk-u-visually-hidden">Important: </span>
          {heading}
        </span>
      </h3>
      <div>{content}</div>
    </div>
  );
};

export default WarningCallout;
