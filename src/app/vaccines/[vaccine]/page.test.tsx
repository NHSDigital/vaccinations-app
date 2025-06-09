import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { generateMetadata } from "@src/app/vaccines/[vaccine]/page";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { assertBackLinkIsPresent } from "@test-data/utils/back-link-helpers";
import {
  getDynamicRoute,
  renderDynamicPage,
} from "@test-data/utils/dynamic-page-helpers";
import { screen } from "@testing-library/react";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine");
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("Dynamic vaccine page", () => {
  it("calls notFound when path is invalid", async () => {
    await renderDynamicPage("test");
    expect(notFound).toHaveBeenCalled();
  });

  describe("generateMetadata()", () => {
    it("returns empty metadata for invalid path", async () => {
      const result = await generateMetadata({
        params: getDynamicRoute("test"),
      });
      expect(result).toEqual({});
    });

    it("returns title metadata of the vaccine for valid path", async () => {
      const result = await generateMetadata({ params: getDynamicRoute("rsv") });
      expect(result).toEqual({
        title: "RSV Vaccine - NHS App",
      });
    });
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
      (Vaccine as jest.Mock).mockImplementation(
        () => new Error("mocked error: content load fail"),
      );
      // suppress noisy logs
      jest.spyOn(console, "error").mockImplementation(() => {});
      renderDynamicPage("rsv");
    });

    afterEach(() => {
      // restore logs
      (console.error as jest.Mock).mockRestore();
    });

    it("shows back link", async () => {
      assertBackLinkIsPresent(screen);
    });

    it("shows error when content has loaded", async () => {
      const rsvHeading = screen.getByRole("heading", {
        level: 1,
        name: "RSV vaccine",
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(rsvHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
