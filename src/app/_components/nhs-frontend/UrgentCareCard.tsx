"use client";

import { Heading } from "@src/services/eligibility-api/types";
import { Card } from "nhsuk-react-components";
import { JSX } from "react";

import styles from "./styles.module.css";

interface NonUrgentCareCardProps {
  heading: Heading | string | JSX.Element;
  content: JSX.Element;
}

const UrgentCareCard = ({ heading, content }: NonUrgentCareCardProps) => {
  return (
    <Card cardType="urgent" data-testid="urgent-care-card">
      <Card.Heading>{heading}</Card.Heading>
      <Card.Content className={styles.careCardZeroMarginBottom}>{content}</Card.Content>
    </Card>
  );
};

export default UrgentCareCard;
