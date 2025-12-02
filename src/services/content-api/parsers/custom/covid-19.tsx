import { HeadingWithContent, HeadingWithTypedContent } from "@src/services/content-api/types";

export function getAdditionalContentForCovid19Vaccine() {
  const callout: HeadingWithTypedContent = {
    heading: "Booking service closed",
    content: [
      "You can no longer book a COVID-19 vaccinations using this online service",
      "Bookings can also no longer be made through the 119 service.",
      "COVID-19 vaccinations will be available again in spring.",
    ].join("\n\n"),
    contentType: "markdown",
  };
  const recommendation: HeadingWithContent = {
    heading: "The COVID-19 vaccine is recommended if you:",
    content: [
      "* are aged 75 or over (including those who will be 75 by 31 January 2026)",
      "* are aged 6 months to 74 years and have a weakened immune system because of a health condition or treatment",
      "* live in a care home for older adults",
    ].join("\n"),
  };
  return {
    callout,
    recommendation,
  };
}
