/**
 * @jest-environment node
 */
import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import { VaccineType } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { Readable } from "stream";

jest.mock("@aws-sdk/client-s3");
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
const mockMarkdownWithStylingHtml = "<ul><li>sausage</li><li>egg</li><li>chips</li></ul>";
jest.mock("@project/src/app/_components/markdown/MarkdownWithStyling", () => ({
  MarkdownWithStyling: () => mockMarkdownWithStylingHtml,
}));
jest.mock("@src/services/nbs/nbs-service", () => ({}));

const mockRsvResponse = {
  Body: new Readable({
    read() {
      this.push(JSON.stringify(mockRsvVaccineJson));
      this.push(null); // End of stream
    },
  }),
};

describe("Content API Read Integration Test ", () => {
  const mockedConfig = config as ConfigMock;

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
    const defaultConfig = configBuilder().withContentCachePath("wiremock/__files/").build();
    Object.assign(mockedConfig, defaultConfig);
  });

  it("should return processed data from external cache", async () => {
    const defaultConfig = configBuilder().withContentCachePath("s3://test-bucket").build();
    Object.assign(mockedConfig, defaultConfig);

    (S3Client as jest.Mock).mockImplementation(() => ({
      send: () => mockRsvResponse,
    }));
  });
});

describe("Content Filter Service Regex", () => {
  it("should extract how to get section text for Rsv Pregancy", async () => {
    const expectedHowToGetContentRsvPregnancy =
      '<h3>How to get the vaccine</h3><p>You should be offered the RSV vaccine around the time of your 28-week antenatal appointment.</p><p>Getting vaccinated as soon as possible from 28 weeks will provide the best protection for your baby. But the vaccine can be given later if needed, including up until you go into labour.</p><p>Speak to your maternity service or GP surgery if you\'re 28 weeks pregnant or more and have not been offered the vaccine.</p><p>In some areas you can also <a href="/api/sso-to-nbs?vaccine=rsv">book an RSV vaccination in a pharmacy</a>.</p>';

    const defaultConfig = configBuilder().withContentCachePath("wiremock/__files/").build();
    Object.assign(mockedConfig, defaultConfig);

    const { styledVaccineContent }: GetContentForVaccineResponse = await getContentForVaccine(
      VaccineType.RSV_PREGNANCY,
    );

    expect(styledVaccineContent?.overviewConclusion?.content).toBe(expectedHowToGetContentRsvPregnancy);
  });

  it("should extract how to get section text for Rsv Older Adults", async () => {
    const expectedHowToGetContentRsvOlderAdults =
      "<h3>If you're aged 75 or over</h3><p>Contact your GP surgery to book your RSV vaccination.</p><p>Your GP surgery may contact you about getting the RSV vaccine. This may be by letter, text, phone call or email.</p><p>You do not need to wait to be contacted before booking your vaccination.</p>";

    const defaultConfig = configBuilder().withContentCachePath("wiremock/__files/").build();
    Object.assign(mockedConfig, defaultConfig);

    const { styledVaccineContent }: GetContentForVaccineResponse = await getContentForVaccine(VaccineType.RSV);

    expect(styledVaccineContent?.howToGetVaccine.component.props.children[0].props.dangerouslySetInnerHTML.__html).toBe(
      expectedHowToGetContentRsvOlderAdults,
    );
  });
});
