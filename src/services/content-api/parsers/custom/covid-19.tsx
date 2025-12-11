import { VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { HeadingWithContent, HeadingWithTypedContent, VaccinePageContent } from "@src/services/content-api/types";
import {
  Action,
  ActionDisplayType,
  ActionWithButton,
  ButtonUrl,
  Content,
  Label,
} from "@src/services/eligibility-api/types";
import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";

const log: Logger = logger.child({ module: "covid-19" });

export const buildFilteredContentForCovid19Vaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const campaigns = await config.CAMPAIGNS;

  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);

  let callout: HeadingWithTypedContent | undefined;
  const actions: Action[] = [];
  if (campaigns.isActive(VaccineType.COVID_19)) {
    log.info("Campaign active");
    callout = undefined;
    actions.push(..._buildActions());
  } else {
    log.info("No campaign active");
    callout = {
      heading: "Booking service closed",
      content: [
        "You can no longer book a COVID-19 vaccination using this online service",
        "Bookings can also no longer be made through the 119 service.",
        "COVID-19 vaccinations will be available again in spring.",
      ].join("\n\n"),
      contentType: "markdown",
    };
  }
  const recommendation: HeadingWithContent = {
    heading: "The COVID-19 vaccine is recommended if you:",
    content: [
      "* are aged 75 or over (including those who will be 75 by 31 January 2026)",
      "* are aged 6 months to 74 years and have a weakened immune system because of a health condition or treatment",
      "* live in a care home for older adults",
    ].join("\n"),
  };

  return { ...standardFilteredContent, callout, recommendation, actions };
};

function _buildActions(): Action[] {
  const nbsBooking: ActionWithButton = {
    type: ActionDisplayType.buttonWithInfo,
    content: ["## If this applies to you", "### Book an appointment online at a pharmacy"].join("\n\n") as Content,
    button: { label: "Continue to booking" as Label, url: new URL("https://example.com") as ButtonUrl },
    delineator: true,
  };
  const walkIn: ActionWithButton = {
    type: ActionDisplayType.actionLinkWithInfo,
    content: [
      "## Get vaccinated without an appointment",
      "You can find a walk-in COVID-19 vaccination site to get a vaccination without an appointment. You do not need to be registered with a GP.",
    ].join("\n\n") as Content,
    button: {
      label: "Find a walk-in COVID-19 vaccination site" as Label,
      url: new URL(
        "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-walk-in-covid-19-vaccination-site/",
      ) as ButtonUrl,
    },
    delineator: false,
  };
  return [nbsBooking, walkIn];
}
