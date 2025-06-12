import axios, { AxiosResponse } from "axios";
import dotenv from 'dotenv';
import { readFile } from "node:fs/promises";

describe('Content API contract', () => {
  beforeAll(async () => {
    dotenv.config({path: ".env.local"});
  });

  it("should match RSV Vaccine Content tolerating changes in LastReviewed dates", async () => {
    const actualEndpoint = process.env["CONTENT_API_ENDPOINT"] + "/nhs-website-content/vaccinations/rsv-vaccine";
    const expected = JSON.parse(await readFile("wiremock/__files/rsv-vaccine.json", { encoding: "utf8" }));

    const response: AxiosResponse = await axios.get(actualEndpoint,
      {
        headers: {
          accept: "application/json",
          apikey: process.env["CONTENT_API_KEY"]
        }
      });

    expectResponseMatchesWithAnyValueForLastReviewed(response.data, expected);
  });

  const expectResponseMatchesWithAnyValueForLastReviewed = (actualVaccineData: any, expectedVaccineData: any) => {
    const {lastReviewed: expectedLastReviewed, ...expectedVaccineContent} = expectedVaccineData;
    const {lastReviewed: actualLastReviewed, ...actualVaccineContent} = actualVaccineData;

    expect(actualVaccineContent).toEqual(expectedVaccineContent);
    expect(actualLastReviewed).toEqual(expect.any(Array)); // replace with line below after jest30
    expect(actualLastReviewed.length).toBeGreaterThan(0);
    actualLastReviewed.map((lastReviewedDate: any) => {
      expect(lastReviewedDate).toEqual(expect.any(String));
    });
    // expect(actualLastReviewed).toEqual(expect.arrayOf(expect.any(String))); // New arrayOf assertion will be available in Jest v30
  };
});
