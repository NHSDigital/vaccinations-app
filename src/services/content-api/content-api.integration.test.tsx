/**
 * @jest-environment node
 */

import { S3Client } from "@aws-sdk/client-s3";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineTypes } from "@src/models/vaccine";
import { configProvider } from "@src/utils/config";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { Readable } from "stream";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";

jest.mock("@src/utils/config");
jest.mock("@aws-sdk/client-s3");

describe("Content API Read Integration Test ", () => {
  it("should return processed data from local cache", async () => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "wiremock/__files/",
    }));
    const { styledVaccineContent, contentError }: GetContentForVaccineResponse =
      await getContentForVaccine(VaccineTypes.RSV);

    expect(styledVaccineContent).not.toBeNull();
    expect(contentError).toBeUndefined();
    expect(styledVaccineContent?.overview).toEqual(
      mockRsvVaccineJson.mainEntityOfPage[0].text,
    );
    expect(styledVaccineContent?.webpageLink).toEqual(
      mockRsvVaccineJson.webpage,
    );
  });

  it("should return processed data from external cache", async () => {
    (configProvider as jest.Mock).mockImplementation(() => ({
      CONTENT_CACHE_PATH: "s3://test-bucket",
    }));
    (S3Client as jest.Mock).mockImplementation(() => ({
      send: () => ({
        Body: new Readable({
          read() {
            this.push(JSON.stringify(mockRsvVaccineJson));
            this.push(null); // End of stream
          },
        }),
      }),
    }));
    const { styledVaccineContent, contentError }: GetContentForVaccineResponse =
      await getContentForVaccine(VaccineTypes.RSV);

    expect(styledVaccineContent).not.toBeNull();
    expect(contentError).toBeUndefined();
    expect(styledVaccineContent?.overview).toEqual(
      mockRsvVaccineJson.mainEntityOfPage[0].text,
    );
    expect(styledVaccineContent?.webpageLink).toEqual(
      mockRsvVaccineJson.webpage,
    );
  });
});
