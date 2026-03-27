import { VaccineType } from "@src/models/vaccine";
import {
  _extractPartsForAspect,
  buildFilteredContentForStandardVaccine,
} from "@src/services/content-api/parsers/content-filter-service";
import {
  ContentApiVaccineResponse,
  HeadingWithContent,
  HeadingWithTypedContent,
  VaccinePageContent,
  VaccinePageSection,
} from "@src/services/content-api/types";
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
  const standardFilteredContent: VaccinePageContent = await buildFilteredContentForStandardVaccine(apiContent);

  const content: ContentApiVaccineResponse = JSON.parse(apiContent);

  const extraDosesSchedule: VaccinePageSection = {
    headline: "Extra doses of the vaccine",
    subsections: _extractPartsForAspect(content, "UsageOrScheduleHealthAspect"),
  };

  const callout: HeadingWithTypedContent = {
    heading: "Service closed",
    content: "COVID-19 vaccinations will be available in spring 2026.",
    contentType: "markdown",
  };
  const actions: Action[] = await _buildActions();
  const preOpenActions: Action[] = await _buildPreOpenActions();

  const recommendation: HeadingWithContent = {
    heading: "The COVID-19 vaccine is recommended if you:",
    content: [
      "* are aged 75 or over (including those who will be 75 by 30 June 2026)",
      "* are aged 6 months to 74 years and have a weakened immune system because of a health condition or treatment",
      "* live in a care home for older adults",
    ].join("\n"),
  };

  return { ...standardFilteredContent, extraDosesSchedule, callout, recommendation, preOpenActions, actions };
};

async function _buildActions(): Promise<Action[]> {
  const nbsURL = (await buildNbsUrl(VaccineType.COVID_19)) as ButtonUrl;

  const nbsBooking: ActionWithButton = {
    type: ActionDisplayType.nbsAuthLinkButtonWithInfo,
    content: [
      "## If this applies to you",
      "### Book an appointment online",
      "You can book an appointment online at some pharmacies, GP surgeries and vaccination centres.",
    ].join("\n\n") as Content,
    button: { label: "Book, cancel or change an appointment" as Label, url: nbsURL },
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
  const contactGP: ActionWithoutButton = {
    type: ActionDisplayType.infotext,
    content: ["### Get vaccinated at your GP surgery", "Contact your GP surgery to book an appointment."].join(
      "\n\n",
    ) as Content,
    button: undefined,
  };

  return [nbsBooking, walkIn, contactGP];
}

async function _buildPreOpenActions(): Promise<Action[]> {
  const nbsURL = (await buildNbsUrl(VaccineType.COVID_19)) as ButtonUrl;

  const nbsBooking: ActionWithButton = {
    type: ActionDisplayType.nbsAuthLinkButtonWithInfo,
    content: [
      "## If this applies to you",
      "You can book a COVID-19 vaccination appointment online now.",
      "Vaccination appointments will take place from 13 April 2026.",
    ].join("\n\n") as Content,
    button: { label: "Book, cancel or change an appointment" as Label, url: nbsURL },
    moreInfo: [
      "From 13 April, you may also be able to get vaccinated at:",
      "* a walk-in COVID-19 vaccination site\n* a local service, such as a community pharmacy or your GP surgery\n* your care home (if you live in a care home)",
    ].join("\n\n") as Content,
  };

  return [nbsBooking];
}
