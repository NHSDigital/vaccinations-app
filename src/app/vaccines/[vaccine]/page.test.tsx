import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/content-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { assertBackLinkIsPresent } from "@test-data/utils/back-link-helpers";
import { renderDynamicPage } from "@test-data/utils/dynamic-page-helpers";
import { screen } from "@testing-library/react";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@src/services/nbs/nbs-service", () => jest.fn());
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn());
jest.mock("@src/services/content-api/content-service", () => ({
  getContentForVaccine: jest.fn(),
}));
jest.mock("@src/app/_components/nhs-frontend/BackLink", () => jest.fn(() => <div data-testid="back-link"></div>));
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

describe("Dynamic vaccine page", () => {
  beforeAll(async () => {
    const fakeHeaders: ReadonlyHeaders = {
      get(name: string): string | null {
        return `fake-${name}-header`;
      },
    } as ReadonlyHeaders;
    (headers as jest.Mock).mockResolvedValue(fakeHeaders);
  });

  it("calls notFound when path is invalid", async () => {
    await renderDynamicPage("test");
    expect(notFound).toHaveBeenCalled();
  });

  it("has vaccine title", async () => {
    await renderDynamicPage("rsv");
    expect(document.title).toBe("RSV vaccine for older adults - Check and book vaccinations - NHS");
  });

  it("renders the feedback banner with correct url", async () => {
    await renderDynamicPage("rsv");
    const feedbackLink: HTMLAnchorElement = screen.getByRole("link", { name: "give your feedback" });
    const feedbackUrl: URL = new URL(feedbackLink.href);

    expect(feedbackLink).toBeVisible();
    expect(feedbackUrl.searchParams.get("page")).toBe("rsv");
  });

  describe("when content loads successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
      renderDynamicPage("rsv");
    });

    it("shows back link", async () => {
      assertBackLinkIsPresent(screen);
    });

    it("shows vaccine content when content has loaded", async () => {
      const rsvHeading = screen.getByRole("heading", {
        level: 1,
        name: "RSV vaccine for older adults",
      });
      expect(rsvHeading).toBeVisible();

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
        },
        undefined,
      );
    });
  });

  describe("when content throws error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(() => new Error("mocked error: content load fail"));
      // suppress noisy logs
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      // restore logs
      (console.error as jest.Mock).mockRestore();
    });

    it("throws error when content throws", async () => {
      await expect(renderDynamicPage("rsv")).rejects.toThrow();
    });
  });
});
