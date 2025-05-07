interface WarningCalloutProps {
  heading: string;
  content: string;
}

const WarningCallout = ({ heading, content }: WarningCalloutProps) => {
  return (
    <div className="nhsuk-warning-callout">
      <h3 className="nhsuk-warning-callout__label">
        {" "}
        <span role="text">
          <span className="nhsuk-u-visually-hidden">Important: </span>
          {heading}
        </span>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default WarningCallout;
