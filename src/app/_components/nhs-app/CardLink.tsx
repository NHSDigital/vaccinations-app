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
          <Link prefetch={false} className="nhsapp-card__link nhsuk-link--no-visited-state" href={cardProps.link}>
            {cardProps.title}
          </Link>
        </div>
        <svg
          className="nhsapp-icon nhsapp-icon__chevron-right"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          height="2rem"
          width="2rem"
          viewBox="0 0 24 24"
        >
          <path d="M8.82 19.11a.97.97 0 0 1-.72-.31.996.996 0 0 1 .03-1.41l5.61-5.38-5.6-5.25c-.4-.38-.42-1.01-.05-1.41.38-.4 1.01-.42 1.41-.05l6.37 5.97c.2.19.31.45.32.72s-.11.54-.31.73l-6.37 6.11c-.19.19-.44.28-.69.28Z" />
        </svg>
      </div>
    </div>
  );
};

export default CardLink;
