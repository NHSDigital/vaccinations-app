import { VaccineType } from "@src/models/vaccine";
import { buildFilteredContentForStandardVaccine } from "@src/services/content-api/parsers/content-filter-service";
import { HeadingWithContent, HeadingWithTypedContent, VaccinePageContent } from "@src/services/content-api/types";
import {
  Action,
  ActionDisplayType,
  ActionWithButton,
  ActionWithoutButton,
  ButtonUrl,
  Content,
  Label,
} from "@src/services/eligibility-api/types";
import { buildNbsUrl } from "@src/services/nbs/nbs-service";

export const buildFilteredContentForCovid19Vaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);

  const callout: HeadingWithTypedContent = {
    heading: "Service closed",
    content: "COVID-19 vaccinations will be available in spring 2026",
    contentType: "markdown",
  };
  const actions: Action[] = await _buildActions();

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

async function _buildActions(): Promise<Action[]> {
  const nbsURl = (await buildNbsUrl(VaccineType.COVID_19)) as ButtonUrl;

  const contactGP: ActionWithoutButton = {
    type: ActionDisplayType.infotext,
    content: [
      "## If this applies to you",
      "### Get vaccinated at your GP surgery",
      "Contact your GP surgery to book an appointment.",
    ].join("\n\n") as Content,
    button: undefined,
  };
  const nbsBooking: ActionWithButton = {
    type: ActionDisplayType.nbsAuthLinkButtonWithInfo,
    content: "### Book an appointment online" as Content,
    button: { label: "Continue to booking" as Label, url: nbsURl },
  };
  const walkIn: ActionWithButton = {
    type: ActionDisplayType.actionLinkWithInfo,
    content: [
      "### Get vaccinated without an appointment",
      "You can find a walk-in COVID-19 vaccination site to get a vaccination without an appointment. You do not need to be registered with a GP.",
    ].join("\n\n") as Content,
    button: {
      label: "Find a walk-in COVID-19 vaccination site" as Label,
      url: new URL(
        "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-walk-in-covid-19-vaccination-site/",
      ) as ButtonUrl,
    },
  };

  return [contactGP, nbsBooking, walkIn];
}
