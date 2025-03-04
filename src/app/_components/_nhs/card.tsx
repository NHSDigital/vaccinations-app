interface cardProps {
  title: string;
}

const Card = (cardProps: cardProps) => {
  return (
    <div className="nhsapp-card">
      <div className="nhsapp-card__container">
        <div className="nhsapp-card__content">
          <a
            href="#"
            className="nhsapp-card__link nhsuk-link--no-visited-state"
          >
            {cardProps.title}
          </a>
        </div>
        <img
          src="/nhsapp-frontend-2.3.0/assets/icons/chevron-right.svg"
          alt="arrow"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Card;
