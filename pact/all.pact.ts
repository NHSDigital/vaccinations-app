import { readFile } from "node:fs/promises";
import axios, { AxiosResponse } from "axios";
import dotenv from 'dotenv';

describe('Content API', () => {
  beforeAll(async () => {
    dotenv.config({path: ".env.local"});  // Load environment variables from .env file
  });

  test("vaccineContent contract", async () => {
    const expected = JSON.parse(await readFile("wiremock/__files/rsv-vaccine.json", { encoding: "utf8" }));

    const actualEndpoint = process.env["CONTENT_API_ENDPOINT"] + "/nhs-website-content/vaccinations/rsv-vaccine";
    const response: AxiosResponse = await axios.get(actualEndpoint,
      {
        headers: {
          accept: "application/json",
          apikey: process.env["CONTENT_API_KEY"]
        }
      });
    const actual = response.data;
    expect(actual).toEqual(expected);
  });
});
