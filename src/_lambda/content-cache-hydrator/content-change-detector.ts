import { VaccinePageContent } from "@src/services/content-api/types";

const vitaContentChangedSinceLastApproved = (
  filteredContent: VaccinePageContent,
  previousApprovedFilteredContent: VaccinePageContent,
): boolean => {
  return JSON.stringify(filteredContent) !== JSON.stringify(previousApprovedFilteredContent);
};

export { vitaContentChangedSinceLastApproved };
