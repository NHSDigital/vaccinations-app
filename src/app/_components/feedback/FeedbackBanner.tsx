import styles from "@src/app/_components/feedback/styles.module.css";

interface FeedbackBannerProps {
  referrer: string;
}

const baseFeedbackUrl = "https://feedback.digital.nhs.uk/jfe/form/SV_cDd4qebuAblVBZ4";

const FeedbackBanner = ({ referrer }: FeedbackBannerProps) => {
  return (
    <div className={`nhsuk-grid-row ${styles.feedbackBannerContainer}`}>
      <p className="nhsuk-body-s nhsuk-u-margin-bottom-0">
        This is a new NHS App service. Help us improve it and{" "}
        <a
          className="nhsuk-link--no-visited-state"
          href={`${baseFeedbackUrl}?page=${referrer}`}
          rel={"noopener"}
          target="_blank"
        >
          give your feedback
        </a>
        .
      </p>
    </div>
  );
};

export { FeedbackBanner };
