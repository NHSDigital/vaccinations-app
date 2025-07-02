import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { getFilteredContentForVaccine } from "@src/services/content-api/parsers/content-filter-service";

const callContentApiRSVEndpoint = async () => {
  const contentEndpoint = process.env["CONTENT_API_ENDPOINT"] + "/nhs-website-content/vaccinations/rsv-vaccine";
  const response: AxiosResponse<string, any> = await axios.get(contentEndpoint, {
    headers: {
      accept: "application/json",
      apikey: process.env["CONTENT_API_KEY"],
    },
  });
  return response;
};

describe("Content API contract", () => {
  beforeAll(async () => {
    dotenv.config({ path: ".env.local" });
  });

  describe("compared to previous cached response", () => {
    it("should not contain any changes in RSV Vaccine fields which are used by VitA", async () => {
      const expected: string = await readFile("wiremock/__files/rsv-vaccine.json", { encoding: "utf8" });
      const expectedFilteredContent = getFilteredContentForVaccine(expected);

      const contentApiRSVResponse: AxiosResponse = await callContentApiRSVEndpoint();
      const contentApiRSVResponseString = JSON.stringify(contentApiRSVResponse.data); // filter service requires content to be in string format
      const actualFilteredContent = getFilteredContentForVaccine(contentApiRSVResponseString);

      expect(Object.keys(actualFilteredContent).length).toEqual(5); // if developers have added new fields this test will need updating to match
      expect(actualFilteredContent.overview).toEqual(expectedFilteredContent.overview);
      expect(actualFilteredContent.howToGetVaccine).toEqual(expectedFilteredContent.howToGetVaccine);
      expect(actualFilteredContent.whatVaccineIsFor).toEqual(expectedFilteredContent.whatVaccineIsFor);
      expect(actualFilteredContent.whoVaccineIsFor).toEqual(expectedFilteredContent.whoVaccineIsFor);
      expect(actualFilteredContent.webpageLink).toEqual(expectedFilteredContent.webpageLink);

      expect(actualFilteredContent).toEqual(expectedFilteredContent);
    });
  });
});
