import stringToHtml from "@src/utils/stringToHtml";

interface NonUrgentCareCardProps {
  content: string;
}

const NonUrgentCareCard = (props: NonUrgentCareCardProps) => {
  return (
    <div className="nhsuk-card nhsuk-card--care nhsuk-card--care--non-urgent">
      <div className="nhsuk-card--care__heading-container">
        <h2 className="nhsuk-card--care__heading">
          <span role="text">
            <span className="nhsuk-u-visually-hidden">Non-urgent advice: </span>
            Title Goes Here!!
          </span>
        </h2>
        <span className="nhsuk-card--care__arrow" aria-hidden="true"></span>
      </div>

      <div
        className="nhsuk-card__content"
        dangerouslySetInnerHTML={stringToHtml(props.content)}
      />
    </div>
  );
};

export default NonUrgentCareCard;
