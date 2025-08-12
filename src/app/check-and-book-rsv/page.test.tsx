import VaccinationsHub from "@src/app/check-and-book-rsv/page";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { ContentErrorTypes } from "@src/services/content-api/types";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/nhs-app/BackToNHSAppLink");

describe("Vaccination Hub Page", () => {
  describe("when content fails to load", () => {
    beforeEach(async () => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: undefined,
        contentError: ContentErrorTypes.CONTENT_LOADING_ERROR,
      });
      render(await VaccinationsHub());
    });

    it("renders the feedback banner with correct url", async () => {
      const feedbackLink: HTMLAnchorElement = screen.getByRole("link", { name: "give your feedback" });
      const feedbackUrl: URL = new URL(feedbackLink.href);

      expect(feedbackLink).toBeVisible();
      expect(feedbackUrl.searchParams.get("page")).toBe("hub");
    });

    it("should not display overview", async () => {
      expect(screen.queryByTestId("overview-text")).not.toBeInTheDocument();
    });

    it("renders heading", async () => {
      expectHeadingToBeRendered();
    });

    it("renders RSV vaccine link", async () => {
      expectRSVLinkToBeRendered();
    });

    it("renders RSV in pregnancy vaccine link", async () => {
      expectRsvPregnancyLinkToBeRendered();
    });
  });

  describe("when content loads successfully", () => {
    beforeEach(async () => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      render(await VaccinationsHub());
    });

    it("renders the feedback banner with correct url", async () => {
      const feedbackLink: HTMLAnchorElement = screen.getByRole("link", { name: "give your feedback" });
      const feedbackUrl: URL = new URL(feedbackLink.href);

      expect(feedbackLink).toBeVisible();
      expect(feedbackUrl.searchParams.get("page")).toBe("hub");
    });

    it("renders overview", async () => {
      expect(screen.getByTestId("overview-text")).toBeVisible();
    });

    it("renders heading", async () => {
      expectHeadingToBeRendered();
    });

    it("renders RSV vaccine link", async () => {
      expectRSVLinkToBeRendered();
    });

    it("renders RSV in pregnancy vaccine link", async () => {
      expectRsvPregnancyLinkToBeRendered();
    });
  });

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

  const expectRsvPregnancyLinkToBeRendered = () => {
    const link = queryLinkByText("RSV vaccine in pregnancy");
    expect(link).toBeVisible();
    expect(link?.getAttribute("href")).toEqual("/vaccines/rsv-pregnancy");
  };

  const expectRSVLinkToBeRendered = () => {
    const link = queryLinkByText("RSV vaccine for older adults");
    expect(link).toBeVisible();
    expect(link?.getAttribute("href")).toEqual("/vaccines/rsv");
  };

  const expectHeadingToBeRendered = () => {
    expect(queryHeading("Check and book an RSV vaccination", 1)).toBeVisible();
  };
});
