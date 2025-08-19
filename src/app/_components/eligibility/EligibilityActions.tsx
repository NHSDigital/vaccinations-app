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
          <>
            <div key={action.content} data-testid="action-paragraph">
              <MarkdownWithStyling content={action.content} />
            </div>
            {action.delineator && <hr />}
          </>
        );
      }
      case ActionDisplayType.card: {
        return (
          <>
            <div key={action.content} data-testid="action-card-component">
              <BasicCard content={action.content} />
            </div>
            {action.delineator && <hr />}
          </>
        );
      }
      case ActionDisplayType.authButton: {
        const infotext = action.content && <BasicCard content={action.content} />;
        const button = action.button && (
          <NBSBookingActionForBaseUrl
            url={action.button.url.href}
            displayText={action.button.label}
            renderAs={"button"}
          />
        );
        return (
          <>
            <div key={action.content} data-testid="action-auth-button-components">
              {infotext}
              {button}
            </div>
            {action.delineator && <hr />}
          </>
        );
      }
    }
  });
};
export { EligibilityActions };
