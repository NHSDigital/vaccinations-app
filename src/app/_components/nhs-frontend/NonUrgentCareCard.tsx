"use client";

import { HeadingLevel } from "@src/services/content-api/types";
import { Heading } from "@src/services/eligibility-api/types";
import { Card } from "nhsuk-react-components";
import { JSX } from "react";

import styles from "./styles.module.css";

interface NonUrgentCareCardProps {
  heading: Heading | string | JSX.Element;
  headingLevel?: HeadingLevel;
  content: JSX.Element;
}

const NonUrgentCareCard = ({ heading, headingLevel, content }: NonUrgentCareCardProps) => {
  return (
    <Card cardType="non-urgent" data-testid="non-urgent-care-card">
      {headingLevel ? (
        <Card.Heading headingLevel={headingLevel}>{heading}</Card.Heading>
      ) : (
        <Card.Heading>{heading}</Card.Heading>
      )}
      <Card.Content className={styles.careCardZeroMarginBottom}>{content}</Card.Content>
    </Card>
  );
};

export default NonUrgentCareCard;
