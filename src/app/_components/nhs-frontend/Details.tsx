import stringToHtml from "@src/utils/stringToHtml";

interface DetailsProps {
  summaryText: string;
  text: string;
}

const Details = (detailsProps: DetailsProps) => {
  return (
    <details className="nhsuk-details nhsuk-expander">
      <summary className="nhsuk-details__summary">
        <span className="nhsuk-details__summary-text">
          <div
            dangerouslySetInnerHTML={stringToHtml(detailsProps.summaryText)}
          />
        </span>
      </summary>
      <div
        className="nhsuk-details__text"
        dangerouslySetInnerHTML={stringToHtml(detailsProps.text)}
      />
    </details>
  );
};

export default Details;
