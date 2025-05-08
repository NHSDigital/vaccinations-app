import { JSX } from "react";

interface NonUrgentCareCardProps {
  heading: JSX.Element;
  content: JSX.Element;
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

      <div className="nhsuk-card__content">{content}</div>
    </div>
  );
};

export default NonUrgentCareCard;
