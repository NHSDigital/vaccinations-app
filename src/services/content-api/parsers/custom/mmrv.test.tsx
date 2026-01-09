import { buildFilteredContentForMMRVVaccine } from "@src/services/content-api/parsers/custom/mmrv";
import { genericVaccineContentAPIResponse } from "@test-data/content-api/data";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/services/nbs/nbs-service", () => ({}));

describe("getFilteredContentForMMRVVaccine", () => {
  it("should return additional information section", async () => {
    const expected = {
      headline: "",
      subsections: [
        {
          type: "simpleElement",
          headline: "",
          text: "<p>This is additional information paragraph 1</p>",
          name: "markdown",
        },
        {
          type: "simpleElement",
          headline: "",
          text: "<p>This is additional information paragraph 2</p>",
          name: "Information",
        },
      ],
    };
    const pageCopy = await buildFilteredContentForMMRVVaccine(JSON.stringify(genericVaccineContentAPIResponse));
    expect(pageCopy.additionalInformation).toEqual(expect.objectContaining(expected));
  });
});
