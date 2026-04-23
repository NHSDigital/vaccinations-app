import { GET } from "@src/app/api/sso-to-nbs/route";
import { VaccineType } from "@src/models/vaccine";
import { getNbsQueryParams, getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import config from "@src/utils/config";
import { ConfigMock, configBuilder } from "@test-data/config/builders";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

jest.mock("@src/utils/config");
jest.mock("@src/services/nbs/nbs-service", () => ({
  getSSOUrlToNBSForVaccine: jest.fn(),
  getNbsQueryParams: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const testUrl = "https://testurl";
const nbsBaseUrl = new URL("https://nbs.example.com");

function getMockRequest(testUrl: string, params?: Record<string, string>) {
  return {
    nextUrl: {
      searchParams: new URLSearchParams(params),
    },
  } as NextRequest;
}

describe("GET /sso-to-nbs", () => {
  const mockedConfig = config as ConfigMock;

  beforeEach(() => {
    jest.clearAllMocks();
    const defaultConfig = configBuilder().withNbsUrl(nbsBaseUrl).build();
    Object.assign(mockedConfig, defaultConfig);
  });

  it("redirects to /service-failure if both parameters are missing", async () => {
    const mockRequest = getMockRequest(testUrl);

    await expectServiceFailureWhenGetCalledWith(mockRequest);
  });

  it("redirects to /service-failure if vaccine parameter is invalid", async () => {
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "test",
    });

    await expectServiceFailureWhenGetCalledWith(mockRequest);
  });

  it("redirects to /service-failure if vaccine parameter is not an allowed vaccine", async () => {
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "sausages",
    });

    await expectServiceFailureWhenGetCalledWith(mockRequest);
  });

  it("redirects to /sso-failure on getSSOUrlToNBSForVaccine error", async () => {
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "rsv",
    });
    (getSSOUrlToNBSForVaccine as jest.Mock).mockRejectedValue(new Error("error"));

    await GET(mockRequest);
    expect(getSSOUrlToNBSForVaccine).toHaveBeenCalledWith(VaccineType.RSV);
    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  it("redirects to nbs sso link from getSSOUrlToNBSForVaccine", async () => {
    const mockNBSUrl = "https://nbs.test?x=y";
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "rsv",
    });
    (getSSOUrlToNBSForVaccine as jest.Mock).mockResolvedValue(mockNBSUrl);

    await GET(mockRequest);
    expect(getSSOUrlToNBSForVaccine).toHaveBeenCalledWith(VaccineType.RSV);
    expect(redirect).toHaveBeenCalledWith(mockNBSUrl);
  });

  it("redirects to target with SSO params when redirectTarget supplied", async () => {
    const redirectTargetUrl = `${nbsBaseUrl.href}some/path`;
    const mockRequest = getMockRequest(redirectTargetUrl, {
      redirectTarget: redirectTargetUrl,
    });
    (getNbsQueryParams as jest.Mock).mockResolvedValue([{ name: "foo", value: "bar" }]);

    await GET(mockRequest);
    expect(getNbsQueryParams).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(`${redirectTargetUrl}?foo=bar`);
  });

  it("redirects to /service-failure if redirectTarget does not start with NBS_URL", async () => {
    const mockRequest = getMockRequest(testUrl, {
      redirectTarget: "https://not-nbs.example.com/some/path",
    });

    await expectServiceFailureWhenGetCalledWith(mockRequest);
  });

  it("redirects to /service-failure if redirectTarget parameter is empty", async () => {
    const mockRequest = getMockRequest(testUrl, {
      redirectTarget: "",
    });

    await expectServiceFailureWhenGetCalledWith(mockRequest);
  });

  it("redirects to /service-failure if redirectTarget parameter is invalid", async () => {
    const mockRequest = getMockRequest(testUrl, {
      redirectTarget: "sausages",
    });

    await expectServiceFailureWhenGetCalledWith(mockRequest);
  });

  it("redirects to /sso-failure on getNbsQueryParams error", async () => {
    const redirectTargetUrl = `${nbsBaseUrl.href}some/path`;
    const mockRequest = getMockRequest(redirectTargetUrl, {
      redirectTarget: redirectTargetUrl,
    });
    (getNbsQueryParams as jest.Mock).mockRejectedValue(new Error("error"));

    await GET(mockRequest);
    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  const expectServiceFailureWhenGetCalledWith = async (mockRequest: NextRequest) => {
    await GET(mockRequest);
    expect(redirect).toHaveBeenCalledWith("/service-failure");
  };
});
