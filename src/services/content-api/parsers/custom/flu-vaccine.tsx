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

export const buildFilteredContentForFluVaccine = async (apiContent: string): Promise<VaccinePageContent> => {
  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);

  const callout: HeadingWithTypedContent = {
    heading: "Service closed",
    content: "Flu vaccinations will be available in autumn 2026.",
    contentType: "string",
  };
  const actions: Action[] = await _buildActions();

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended if you:",
    content: [
      "* are aged 65 or older (including those who will be 65 by 31 March 2026)",
      "* have certain long-term health conditions",
      "* are pregnant",
      "* live in a care home",
      "* are the main carer for an older or disabled person, or receive a carer's allowance",
      "* live with someone who has a weakened immune system",
    ].join("\n"),
  };
  return { ...standardFilteredContent, callout, recommendation, actions };
};

async function _buildActions(): Promise<Action[]> {
  const nbsURl = (await buildNbsUrl(VaccineType.FLU_FOR_ADULTS)) as ButtonUrl;

  const bookWithGP: ActionWithoutButton = {
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
    content: ["### Book an appointment online"].join("\n\n") as Content,
    button: { label: "Continue to booking" as Label, url: nbsURl },
  };
  const walkIn: ActionWithButton = {
    type: ActionDisplayType.actionLinkWithInfo,
    content: [
      "### Get vaccinated without an appointment",
      "You can find a pharmacy that offers walk-in appointments without booking.",
    ].join("\n\n") as Content,
    button: {
      label: "Find a pharmacy where you can get a free flu vaccination" as Label,
      url: new URL(
        "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/find-a-pharmacy-that-offers-free-flu-vaccination/",
      ) as ButtonUrl,
    },
  };
  return [bookWithGP, nbsBooking, walkIn];
}
