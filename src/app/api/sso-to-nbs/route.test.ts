import { GET } from "@src/app/api/sso-to-nbs/route";
import { VaccineTypes } from "@src/models/vaccine";
import { getSSOUrlToNBSForVaccine } from "@src/services/nbs/nbs-service";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

jest.mock("@src/services/nbs/nbs-service", () => ({
  getSSOUrlToNBSForVaccine: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

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

  it("returns 404 if vaccine parameter is missing", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl);

    await GET(mockRequest);
    expect(notFound).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns 404 if vaccine parameter is invalid", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "test",
    });

    await GET(mockRequest);
    expect(notFound).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /sso-failure on getSSOUrlToNBSForVaccine error", async () => {
    const testUrl = "https://testurl";
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "rsv",
    });
    (getSSOUrlToNBSForVaccine as jest.Mock).mockRejectedValue(
      new Error("error"),
    );

    await GET(mockRequest);
    expect(getSSOUrlToNBSForVaccine).toHaveBeenCalledWith(VaccineTypes.RSV);
    expect(redirect).toHaveBeenCalledWith("/sso-failure");
  });

  it("redirects to nbs sso link from getSSOUrlToNBSForVaccine", async () => {
    const testUrl = "https://testurl";
    const mockNBSUrl = "https://nbs.test?x=y";
    const mockRequest = getMockRequest(testUrl, {
      vaccine: "rsv",
    });
    (getSSOUrlToNBSForVaccine as jest.Mock).mockResolvedValue(mockNBSUrl);

    await GET(mockRequest);
    expect(getSSOUrlToNBSForVaccine).toHaveBeenCalledWith(VaccineTypes.RSV);
    expect(redirect).toHaveBeenCalledWith(mockNBSUrl);
  });
});
