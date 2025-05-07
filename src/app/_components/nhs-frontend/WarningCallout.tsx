import sanitiseHtml from "@src/utils/sanitise-html";

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
      <div dangerouslySetInnerHTML={sanitiseHtml(content)} />
    </div>
  );
};

export default WarningCallout;
