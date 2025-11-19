"use client";

interface WarningCalloutProps {
  heading: string;
  content: string;
}

const WarningCallout = ({ heading, content }: WarningCalloutProps) => {
  return (
    <div data-testid="callout" className="nhsuk-warning-callout">
      <h3 className="nhsuk-warning-callout__label">
        <span role="text">
          <span className="nhsuk-u-visually-hidden">Important: </span>
          {heading}
        </span>
      </h3>
      <div data-testid="callout-text" dangerouslySetInnerHTML={{ __html: content || "" }} />
    </div>
  );
};

export default WarningCallout;
