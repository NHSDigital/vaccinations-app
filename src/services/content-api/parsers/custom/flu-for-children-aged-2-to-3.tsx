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

export const buildFilteredContentForFluForChildrenAged2to3 = async (
  apiContent: string,
): Promise<VaccinePageContent> => {
  const standardFilteredContent = await buildFilteredContentForStandardVaccine(apiContent);

  const callout: HeadingWithTypedContent = {
    heading: "Service closed",
    content: "Flu vaccinations will be available in autumn 2026",
    contentType: "string",
  };

  const actions: Action[] = await _buildActions();

  const recommendation: HeadingWithContent = {
    heading: "The flu vaccine is recommended for children who:",
    content: ["* are aged 2 or 3 years (born between September 2021 and 31 August 2023)"].join("\n"),
  };
  return { ...standardFilteredContent, callout, recommendation, actions };
};

async function _buildActions(): Promise<Action[]> {
  const bookWithGP: ActionWithoutButton = {
    type: ActionDisplayType.infotext,
    content: [
      "## If this applies to your child",
      "### Get vaccinated at your GP surgery",
      "Contact your GP surgery to book an appointment.",
    ].join("\n\n") as Content,
    button: undefined,
  };

  const bookOnline: ActionWithButton = {
    type: ActionDisplayType.buttonWithoutAuthLinkWithInfo,
    content: [
      "### Book an appointment online",
      "You can book an appointment online at some pharmacies, GP surgeries and vaccination centres.",
    ].join("\n\n") as Content,
    button: {
      label: "Book, cancel or change an appointment" as Label,
      url: new URL(
        "https://www.nhs.uk/nhs-services/vaccination-and-booking-services/book-flu-vaccination/",
      ) as ButtonUrl,
    },
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
  return [bookWithGP, bookOnline, walkIn];
}
