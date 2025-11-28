import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { NBSBookingActionForBaseUrl } from "@src/app/_components/nbs/NBSBookingAction";
import { BasicCard } from "@src/app/_components/nhs-frontend/BasicCard";
import { Action, ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { ActionLink } from "nhsuk-react-components";
import React, { JSX } from "react";

interface EligibilityActionProps {
  actions: Action[];
}

const EligibilityActions = ({ actions }: EligibilityActionProps): (JSX.Element | undefined)[] => {
  return actions.map((action: Action) => {
    switch (action.type) {
      case ActionDisplayType.infotext: {
        return <InfoText content={action.content} delineator={action.delineator} />;
      }
      case ActionDisplayType.card: {
        return <Card content={action.content} delineator={action.delineator} />;
      }
      case ActionDisplayType.buttonWithCard: {
        const card = action.content && <BasicCard content={action.content} delineator={false} />;
        const button = action.button && (
          <Button
            url={action.button.url}
            label={action.button.label}
            renderAs={"button"}
            delineator={action.delineator}
          />
        );
        return (
          <div key={action.content} data-testid="action-auth-button-components">
            {card}
            {button}
            {action.delineator && <hr />}
          </div>
        );
      }
      case ActionDisplayType.buttonWithInfo: {
        const info = action.content && <InfoText content={action.content} delineator={false} />;
        const button = action.button && (
          <Button
            url={action.button.url}
            label={action.button.label}
            renderAs={"button"}
            delineator={action.delineator}
          />
        );
        return (
          <div key={action.content} data-testid="action-auth-button-components">
            {info}
            {button}
            {action.delineator && <hr />}
          </div>
        );
      }
      case ActionDisplayType.actionLinkWithInfo: {
        const info = action.content && <InfoText content={action.content} delineator={false} />;
        const link = action.button && (
          <ActionLink
            className={action.delineator ? "nhsuk-u-margin-bottom-0" : undefined}
            asElement="a"
            href={action.button.url.href}
            rel="noopener"
            target="_blank"
          >
            {action.button.label}
          </ActionLink>
        );
        return (
          <div key={action.content} data-testid="action-auth-link-components">
            {info}
            {link}
            {action.delineator && <hr />}
          </div>
        );
      }
    }
  });
};

type InfoTextProps = {
  content: Content;
  delineator: boolean;
};

const InfoText = ({ content, delineator }: InfoTextProps): JSX.Element => {
  return (
    <div key={content} data-testid="action-paragraph">
      <MarkdownWithStyling content={content} delineator={delineator} />
    </div>
  );
};

type CardProps = {
  content: Content;
  delineator: boolean;
};

const Card = ({ content, delineator }: CardProps): JSX.Element => {
  return (
    <div key={content} data-testid="action-card-component">
      <BasicCard content={content} delineator={delineator} />
    </div>
  );
};

type ButtonProps = {
  url: ButtonUrl;
  label: Label;
  renderAs: "anchor" | "button" | "actionLink";
  delineator: boolean;
};

const Button = ({ url, label, renderAs, delineator }: ButtonProps): JSX.Element => {
  return (
    <NBSBookingActionForBaseUrl
      url={url.href}
      displayText={label}
      renderAs={renderAs}
      reduceBottomPadding={delineator}
    />
  );
};

export { EligibilityActions };
