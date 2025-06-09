import axios, { AxiosResponse } from "axios";
import dotenv from 'dotenv';
import { matchRSVResponse } from "./pact-helpers";

describe('Content API', () => {
  beforeAll(async () => {
    dotenv.config({path: ".env.local"});  // Load environment variables from .env file
  });

  test("vaccineContent contract", async () => {
    const actualEndpoint = process.env["CONTENT_API_ENDPOINT"] + "/nhs-website-content/vaccinations/rsv-vaccine";
    const response: AxiosResponse = await axios.get(actualEndpoint,
      {
        headers: {
          accept: "application/json",
          apikey: process.env["CONTENT_API_KEY"]
        }
      });
    matchRSVResponse(response.data);
  });
});
