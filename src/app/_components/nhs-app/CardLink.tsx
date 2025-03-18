import Link from "next/link";

interface CardProps {
  title: string;
  link: string;
}

const CardLink = (cardProps: CardProps) => {
  return (
    <div className="nhsapp-card">
      <div className="nhsapp-card__container">
        <div className="nhsapp-card__content">
          <Link
            prefetch={false}
            className="nhsapp-card__link nhsuk-link--no-visited-state"
            href={cardProps.link}
          >
            {cardProps.title}
          </Link>
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

export default CardLink;
