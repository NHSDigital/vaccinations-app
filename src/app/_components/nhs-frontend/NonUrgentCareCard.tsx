"use client";

import { Heading } from "@src/services/eligibility-api/types";
import { Card } from "nhsuk-react-components";
import { JSX } from "react";

interface NonUrgentCareCardProps {
  heading: Heading | string;
  content: JSX.Element;
}

const NonUrgentCareCard = ({ heading, content }: NonUrgentCareCardProps) => {
  return (
    <Card cardType="non-urgent" data-testid="non-urgent-care-card">
      <Card.Heading>{heading}</Card.Heading>
      <Card.Content>{content}</Card.Content>
    </Card>
  );
};

export default NonUrgentCareCard;
