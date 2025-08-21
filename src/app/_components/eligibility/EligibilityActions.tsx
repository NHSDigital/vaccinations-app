import { MarkdownWithStyling } from "@src/app/_components/markdown/MarkdownWithStyling";
import { NBSBookingActionForBaseUrl } from "@src/app/_components/nbs/NBSBookingAction";
import ActionLink from "@src/app/_components/nhs-frontend/ActionLink";
import { BasicCard } from "@src/app/_components/nhs-frontend/BasicCard";
import { Action, ActionDisplayType, ButtonUrl, Content, Label } from "@src/services/eligibility-api/types";
import React, { JSX } from "react";

interface EligibilityActionProps {
  actions: Action[];
}

const EligibilityActions = ({ actions }: EligibilityActionProps): (JSX.Element | undefined)[] => {
  return actions.map((action: Action) => {
    switch (action.type) {
      case ActionDisplayType.infotext: {
        return _infotext(action.content, action.delineator);
      }
      case ActionDisplayType.card: {
        return _card(action.content, action.delineator);
      }
      case ActionDisplayType.buttonWithCard: {
        const card = action.content && <BasicCard content={action.content} delineator={false} />;
        const button = action.button && _button(action.button.url, action.button.label, "button", action.delineator);
        return (
          <div key={action.content} data-testid="action-auth-button-components">
            {card}
            {button}
            {action.delineator && <hr />}
          </div>
        );
      }
      case ActionDisplayType.buttonWithInfo: {
        const info = action.content && _infotext(action.content, false);
        const button = action.button && _button(action.button.url, action.button.label, "button", action.delineator);
        return (
          <div key={action.content} data-testid="action-auth-button-components">
            {info}
            {button}
            {action.delineator && <hr />}
          </div>
        );
      }
      case ActionDisplayType.actionLinkWithInfo: {
        const info = action.content && _infotext(action.content, false);
        const link = action.button && <ActionLink url={action.button.url.href} displayText={action.button.label} />;
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

const _infotext = (content: Content, delineator: boolean): JSX.Element => {
  return (
    <div key={content} data-testid="action-paragraph">
      <MarkdownWithStyling content={content} delineator={delineator} />
    </div>
  );
};

const _card = (content: Content, delineator: boolean): JSX.Element => {
  return (
    <div key={content} data-testid="action-card-component">
      <BasicCard content={content} delineator={delineator} />
    </div>
  );
};

const _button = (
  url: ButtonUrl,
  label: Label,
  renderAs: "anchor" | "button" | "actionLink",
  delineator: boolean,
): JSX.Element => {
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
