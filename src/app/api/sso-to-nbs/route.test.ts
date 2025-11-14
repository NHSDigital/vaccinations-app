import { GET } from "@src/app/api/sso-to-nbs/route";
import { VaccineType } from "@src/models/vaccine";
import { getNbsQueryParams, getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

jest.mock("@src/services/nbs/nbs-service", () => ({
  getSSOUrlToNBSForVaccine: jest.fn(),
  getNbsQueryParams: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const testUrl = "https://testurl";

function getMockRequest(testUrl: string, params?: Record<string, string>) {
  return {
    nextUrl: {
      searchParams: new URLSearchParams(params),
    },
  } as NextRequest;
}

describe("GET /sso-to-nbs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 404 if both parameters are missing", async () => {
    const mockRequest = getMockRequest(testUrl);

    await expect404WhenGetCalledWith(mockRequest);
  });

  it("returns 404 if vaccine parameter is invalid", async () => {
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "test",
    });

    await expect404WhenGetCalledWith(mockRequest);
  });

  it("returns 404 if vaccine parameter is not an allowed vaccine", async () => {
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "td-ipv-vaccine-3-in-1-teenage-booster",
    });

    await expect404WhenGetCalledWith(mockRequest);
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
    const redirectTargetUrl = "https://target.url";
    const mockRequest = getMockRequest(redirectTargetUrl, {
      redirectTarget: redirectTargetUrl,
    });
    (getNbsQueryParams as jest.Mock).mockResolvedValue([{ name: "foo", value: "bar" }]);

    await GET(mockRequest);
    expect(getNbsQueryParams).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("https://target.url/?foo=bar");
  });

  it("returns 404 if redirectTarget parameter is empty", async () => {
    const mockRequest = getMockRequest(testUrl, {
      redirectTarget: "",
    });

    await expect404WhenGetCalledWith(mockRequest);
  });

  it("returns 404 if redirectTarget parameter is invalid", async () => {
    const mockRequest = getMockRequest(testUrl, {
      redirectTarget: "sausages",
    });

    await expect404WhenGetCalledWith(mockRequest);
  });

  it("redirects to /sso-failure on getNbsQueryParams error", async () => {
    const redirectTargetUrl = "https://target.url";
    const mockRequest = getMockRequest(redirectTargetUrl, {
      redirectTarget: redirectTargetUrl,
    });
    (getNbsQueryParams as jest.Mock).mockRejectedValue(new Error("error"));

    await GET(mockRequest);
    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  const expect404WhenGetCalledWith = async (mockRequest: NextRequest) => {
    await GET(mockRequest);
    expect(notFound).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  };
});
