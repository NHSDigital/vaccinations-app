import stringToHtml from "@src/utils/stringToHtml";

interface NonUrgentCareCardProps {
  heading: string;
  content: string;
}

const NonUrgentCareCard = ({ heading, content }: NonUrgentCareCardProps) => {
  return (
    <div className="nhsuk-card nhsuk-card--care nhsuk-card--care--non-urgent">
      <div className="nhsuk-card--care__heading-container">
        <h3 className="nhsuk-card--care__heading">
          <span role="text">
            <span className="nhsuk-u-visually-hidden">Non-urgent advice: </span>
            {heading}
          </span>
        </h3>
        <span className="nhsuk-card--care__arrow" aria-hidden="true"></span>
      </div>

      <div
        className="nhsuk-card__content"
        dangerouslySetInnerHTML={stringToHtml(content)}
      />
    </div>
  );
};

export default NonUrgentCareCard;
