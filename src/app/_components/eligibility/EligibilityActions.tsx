import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import {
  NBSBookingActionWithAuthSSOForBaseUrl,
  NBSBookingActionWithoutAuthForUrl,
} from "@src/app/_components/nbs/NBSBookingAction";
import { BasicCard } from "@src/app/_components/nhs-frontend/BasicCard";
import { VaccineType } from "@src/models/vaccine";
import { Action, ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import { ActionLink } from "nhsuk-react-components";
import React, { JSX } from "react";

interface EligibilityActionProps {
  actions: Action[];
  vaccineType: VaccineType;
}

const EligibilityActions = ({ actions, vaccineType }: EligibilityActionProps): (JSX.Element | undefined)[] => {
  return actions.map((action: Action, index: number) => {
    const isNotLastAction: boolean = index < actions.length - 1;

    switch (action.type) {
      case ActionDisplayType.infotext: {
        return <InfoText key={index} content={action.content} delineator={isNotLastAction} />;
      }

      case ActionDisplayType.card: {
        return <Card key={index} content={action.content} delineator={isNotLastAction} />;
      }

      case ActionDisplayType.nbsAuthLinkButtonWithCard: {
        const card = action.content && <BasicCard content={action.content} delineator={false} />;
        const button = action.button && (
          <NBSAuthSSOBookingButton
            vaccineType={vaccineType}
            url={action.button.url}
            label={action.button.label}
            renderAs={"button"}
            delineator={false}
          />
        );
        return (
          <div key={index} data-testid="action-auth-button-components">
            {card}
            {button}
            {isNotLastAction && <hr />}
          </div>
        );
      }

      case ActionDisplayType.nbsAuthLinkButtonWithInfo: {
        const info = action.content && <InfoText content={action.content} delineator={false} />;
        const button = action.button && (
          <NBSAuthSSOBookingButton
            vaccineType={vaccineType}
            url={action.button.url}
            label={action.button.label}
            renderAs={"button"}
            delineator={false}
          />
        );
        return (
          <div key={index} data-testid="action-auth-button-components">
            {info}
            {button}
            {isNotLastAction && <hr />}
          </div>
        );
      }

      case ActionDisplayType.buttonWithoutAuthLinkWithInfo: {
        const info = action.content && <InfoText content={action.content} delineator={false} />;
        const button = action.button && (
          <NBSBookingActionWithoutAuthForUrl
            url={action.button.url.href}
            displayText={action.button.label}
            renderAs={"button"}
            reduceBottomPadding={true}
          />
        );
        return (
          <div key={index} data-testid="action-button-without-auth-components">
            {info}
            {button}
            {isNotLastAction && <hr />}
          </div>
        );
      }

      case ActionDisplayType.actionLinkWithInfo: {
        const info = action.content && <InfoText content={action.content} delineator={false} />;
        const link = action.button && (
          <ActionLink
            className={"nhsuk-u-margin-bottom-0"} // we can remove margin as there is no text below the action link currently
            asElement="a"
            href={action.button.url.href}
            rel="noopener"
            target="_blank"
          >
            {action.button.label}
          </ActionLink>
        );
        return (
          <div key={index} data-testid="action-auth-link-components">
            {info}
            {link}
            {isNotLastAction && <hr />}
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
  vaccineType: VaccineType;
  url: ButtonUrl;
  label: Label;
  renderAs: "anchor" | "button" | "actionLink";
  delineator: boolean;
};

const NBSAuthSSOBookingButton = ({ vaccineType, url, label, renderAs }: ButtonProps): JSX.Element => {
  return (
    <NBSBookingActionWithAuthSSOForBaseUrl
      vaccineType={vaccineType}
      url={url.href}
      displayText={label}
      renderAs={renderAs}
      reduceBottomPadding={true}
    />
  );
};

export { EligibilityActions };
