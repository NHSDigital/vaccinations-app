import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import VaccinationsHub from "@src/app/check-and-book-rsv/page";

jest.mock("@src/services/content-api/gateway/content-reader-service");

const queryHeading = (text: string, level: number): HTMLElement | null => {
  return screen.queryByRole("heading", {
    name: text,
    level: level,
  });
};

const queryLinkByText = (text: string): HTMLElement | null => {
  return screen.queryByRole("link", {
    name: text,
  });
};

describe("Vaccination Hub Page", () => {
  describe("when content fails to load", () => {
    beforeEach(async () => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      render(await VaccinationsHub());
    });

    it("renders heading", async () => {
      expect(
        queryHeading("Check and book an RSV vaccination", 1),
      ).toBeVisible();
    });

    it("should display error summary", async () => {
      expect(getContentForVaccine).toHaveBeenCalled();
      expect(
        queryHeading("Vaccine content is unavailable", 2),
      ).toBeInTheDocument();
    });

    it("should not render any other areas of the hub page", async () => {
      expect(screen.queryByTestId("overview-text")).toBeNull();
      expect(queryLinkByText("RSV for older adults")).toBeNull();
      expect(queryLinkByText("RSV vaccine in pregnancy")).toBeNull();
    });
  });

  describe("when content loads successfully", () => {
    beforeEach(async () => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      render(await VaccinationsHub());
    });

    it("renders overview", async () => {
      expect(screen.getByTestId("overview-text")).toBeVisible();
    });

    it("renders heading", async () => {
      expect(
        queryHeading("Check and book an RSV vaccination", 1),
      ).toBeVisible();
    });

    it("renders RSV vaccine link", async () => {
      const link = queryLinkByText("RSV vaccine for older adults");
      expect(link).toBeVisible();
      expect(link?.getAttribute("href")).toEqual("/vaccines/rsv");
    });

    it("renders RSV in pregnancy vaccine link", async () => {
      const link = queryLinkByText("RSV vaccine in pregnancy");
      expect(link).toBeVisible();
      expect(link?.getAttribute("href")).toEqual("/vaccines/rsv-pregnancy");
    });
  });
});
