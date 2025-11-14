/**
 * @jest-environment node
 */
import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import { configProvider } from "@src/utils/config";
import { Readable } from "stream";

jest.mock("@src/utils/config");
jest.mock("@aws-sdk/client-s3");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockRsvResponse = {
  Body: new Readable({
    read() {
      this.push(JSON.stringify(mockRsvVaccineJson));
      this.push(null); // End of stream
    },
  }),
};

describe("Content API Read Integration Test ", () => {
  afterEach(async () => {
    const { styledVaccineContent, contentError }: GetContentForVaccineResponse = await getContentForVaccine(
      VaccineType.RSV,
    );

    expect(styledVaccineContent).not.toBeNull();
    expect(contentError).toBeUndefined();
    expect(styledVaccineContent?.overview).toEqual(mockRsvVaccineJson.mainEntityOfPage[0].text);
    expect(styledVaccineContent?.webpageLink.href).toEqual(mockRsvVaccineJson.webpage);
  });

  it("should return processed data from local cache", async () => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "wiremock/__files/",
    }));
  });

  it("should return processed data from external cache", async () => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "s3://test-bucket",
    }));
    (S3Client as jest.Mock).mockImplementation(() => ({
      send: () => mockRsvResponse,
    }));
  });
});
