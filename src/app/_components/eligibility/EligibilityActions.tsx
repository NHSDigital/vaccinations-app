import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { NBSBookingActionForBaseUrl } from "@src/app/_components/nbs/NBSBookingAction";
import { BasicCard } from "@src/app/_components/nhs-frontend/BasicCard";
import { Action, ActionDisplayType } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface EligibilityActionProps {
  actions: Action[];
}

const EligibilityActions = ({ actions }: EligibilityActionProps): (JSX.Element | undefined)[] => {
  return actions.map((action: Action) => {
    switch (action.type) {
      case ActionDisplayType.infotext: {
        return (
          <div key={action.content} data-testid="action-paragraph">
            <MarkdownWithStyling content={action.content} delineator={action.delineator} />
          </div>
        );
      }
      case ActionDisplayType.card: {
        return (
          <div key={action.content} data-testid="action-card-component">
            <BasicCard content={action.content} delineator={action.delineator} />
          </div>
        );
      }
      case ActionDisplayType.buttonWithCard: {
        const card = action.content && <BasicCard content={action.content} delineator={false} />;
        const button = action.button && (
          <NBSBookingActionForBaseUrl
            url={action.button.url.href}
            displayText={action.button.label}
            renderAs={"button"}
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
        const info = action.content && (
          <div key={action.content} data-testid="action-paragraph">
            <MarkdownWithStyling content={action.content} delineator={action.delineator} />
          </div>
        );
        const button = action.button && (
          <NBSBookingActionForBaseUrl
            url={action.button.url.href}
            displayText={action.button.label}
            renderAs={"button"}
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
        const info = action.content && (
          <div key={action.content} data-testid="action-paragraph">
            <MarkdownWithStyling content={action.content} delineator={false} />
          </div>
        );
        const actionLink = action.button && (
          <NBSBookingActionForBaseUrl
            url={action.button.url.href}
            displayText={action.button.label}
            renderAs={"actionLink"}
          />
        );
        return (
          <div key={action.content} data-testid="action-auth-button-components">
            {info}
            {actionLink}
            {action.delineator && <hr />}
          </div>
        );
      }
    }
  });
};
export { EligibilityActions };
