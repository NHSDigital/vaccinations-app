"use client";

import { HeadingLevel } from "@src/services/content-api/types";
import { Heading } from "@src/services/eligibility-api/types";
import { Card } from "nhsuk-react-components";
import { JSX } from "react";

import styles from "./styles.module.css";

interface EmergencyCareCardProps {
  heading: Heading | string | JSX.Element;
  headingLevel?: HeadingLevel;
  content: JSX.Element;
}

// Ref: https://service-manual.nhs.uk/design-system/patterns/help-users-decide-when-and-where-to-get-care
const EmergencyCareCard = ({ heading, headingLevel, content }: EmergencyCareCardProps) => {
  return (
    <Card cardType="emergency" data-testid="emergency-care-card">
      {headingLevel ? (
        <Card.Heading headingLevel={headingLevel}>{heading}</Card.Heading>
      ) : (
        <Card.Heading>{heading}</Card.Heading>
      )}
      <Card.Content className={styles.careCardZeroMarginBottom}>{content}</Card.Content>
    </Card>
  );
};

export default EmergencyCareCard;
