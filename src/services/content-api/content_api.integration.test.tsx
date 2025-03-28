/**
 * @jest-environment node
 */

import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/parsers/contentStylingService";
import { VaccineTypes } from "@src/models/vaccine";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("@src/utils/config", () => () => ({
  CONTENT_API_ENDPOINT: "https://content-endpoint",
}));

const fetchMock = jest.spyOn(global, "fetch").mockImplementation(
  jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: () => Promise.resolve(genericVaccineContentAPIResponse),
    }),
  ) as jest.Mock,
);

describe("Content API Integration Test ", () => {
  it("should return processed data from external Content API", async () => {
    const styledVaccineContent: StyledVaccineContent =
      await getStyledContentForVaccine(VaccineTypes.RSV);

    expect(fetchMock).toHaveBeenCalled();
    expect(styledVaccineContent).not.toBeNull();
    expect(styledVaccineContent.overview).toEqual(
      genericVaccineContentAPIResponse.mainEntityOfPage[0].text,
    );
    expect(styledVaccineContent.webpageLink).toEqual(
      genericVaccineContentAPIResponse.webpage,
    );
  });
});
