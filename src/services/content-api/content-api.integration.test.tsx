/**
 * @jest-environment node
 */
import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import lazyConfig from "@src/utils/lazy-config";
import { AsyncConfigMock, lazyConfigBuilder } from "@test-data/config/builders";
import { Readable } from "stream";

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
  const mockedConfig = lazyConfig as AsyncConfigMock;

  afterEach(async () => {
    const { styledVaccineContent, contentError }: GetContentForVaccineResponse = await getContentForVaccine(
      VaccineType.RSV,
    );

    expect(styledVaccineContent).not.toBeNull();
    expect(contentError).toBeUndefined();
    expect(styledVaccineContent?.overview).toEqual({
      content: mockRsvVaccineJson.mainEntityOfPage[0].text,
      containsHtml: false,
    });
    expect(styledVaccineContent?.webpageLink.href).toEqual(mockRsvVaccineJson.webpage);
  });

  it("should return processed data from local cache", async () => {
    const defaultConfig = lazyConfigBuilder().withContentCachePath("wiremock/__files/").build();
    Object.assign(mockedConfig, defaultConfig);
  });

  it("should return processed data from external cache", async () => {
    const defaultConfig = lazyConfigBuilder().withContentCachePath("s3://test-bucket").build();
    Object.assign(mockedConfig, defaultConfig);

    (S3Client as jest.Mock).mockImplementation(() => ({
      send: () => mockRsvResponse,
    }));
  });
});
