import axios, { AxiosResponse } from "axios";
import dotenv from 'dotenv';
import { readFile } from "node:fs/promises";

describe('Content API', () => {
  beforeAll(async () => {
    dotenv.config({path: ".env.local"});
  });

  test("vaccineContent contract", async () => {
    const actualEndpoint = process.env["CONTENT_API_ENDPOINT"] + "/nhs-website-content/vaccinations/rsv-vaccine";
    const expected = JSON.parse(await readFile("wiremock/__files/rsv-vaccine.json", { encoding: "utf8" }));
    const response: AxiosResponse = await axios.get(actualEndpoint,
      {
        headers: {
          accept: "application/json",
          apikey: process.env["CONTENT_API_KEY"]
        }
      });
    expect(response.data).toEqual(expected);
  });
});
