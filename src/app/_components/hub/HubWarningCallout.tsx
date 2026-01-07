import { JSX } from "react";

type HubWarningCalloutProps = {
  heading: string;
  content: JSX.Element;
};

const HubWarningCallout = (props: HubWarningCalloutProps) => {
  return (
    <div data-testid="callout" className={`nhsuk-warning-callout`}>
      <h3 className="nhsuk-warning-callout__label">
        <span role="text">
          <span className="nhsuk-u-visually-hidden">Important: </span>
          {props.heading}
        </span>
      </h3>
      <div data-testid="callout-text">{props.content}</div>
    </div>
  );
};

export default HubWarningCallout;
