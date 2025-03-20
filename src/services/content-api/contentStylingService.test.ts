import {
  getStyledContentForVaccine,
  StyledPageSection,
  StyledVaccineContent,
  styleSection,
  styleSubsection,
} from "@src/services/content-api/contentStylingService";
import { render, screen } from "@testing-library/react";
import { expect } from "@jest/globals";
import {
  getFilteredContentForVaccine,
  VaccinePageContent,
  VaccinePageSection,
} from "@src/services/content-api/contentFilter";
import { VaccineTypes } from "@src/models/vaccine";
import { isValidElement } from "react";

jest.mock("@src/services/content-api/contentFilter");

describe("ContentStyleService", () => {
  const mockMarkdownSubsection = {
    text: "<h2>This is a styled paragraph markdown subsection</h2>",
    name: "markdown",
    headline: "Headline",
  };

  const mockNonUrgentSubsection = {
    text: "<h3>Heading for Non Urgent Component</h3><p>This is a styled paragraph non-urgent subsection</p>",
    name: "non-urgent",
    headline: "",
  };

  describe("styleSubsection", () => {
    it("should return styled markdown component for subsection beginning with headline", () => {
      const styledSubsection = styleSubsection(mockMarkdownSubsection, 1);
      render(styledSubsection);

      const heading1 = screen.getByRole("heading", { name: "Headline" });
      const heading2 = screen.getByRole("heading", {
        name: "This is a styled paragraph markdown subsection",
      });
      expect(heading1).toBeInTheDocument();
      expect(heading2).toBeInTheDocument();
    });

    it("should return styled markdown component for subsection", () => {
      const mockMarkdownSubsection = {
        text: "<div role='section'>This is a styled paragraph markdown subsection</div>",
        name: "markdown",
        headline: "",
      };

      const styledSubsection = styleSubsection(mockMarkdownSubsection, 1);
      render(styledSubsection);

      const div = screen.getByRole("section");

      expect(div).toBeInTheDocument();
      expect(div.textContent).toEqual(
        "This is a styled paragraph markdown subsection",
      );
    });

    it("should return styled information component for subsection", () => {
      const mockInformationSubsection = {
        text: "<p>This is a styled paragraph information subsection</p>",
        name: "Information",
        headline: "",
      };

      const styledSubsection = styleSubsection(mockInformationSubsection, 1);
      render(styledSubsection);

      const text = screen.getByText(
        "This is a styled paragraph information subsection",
      );
      const information = screen.getByText("Information:");

      expect(information).toBeInTheDocument();
      expect(information.className).toEqual("nhsuk-u-visually-hidden");
      expect(text).toBeInTheDocument();
    });

    it("should return styled non-urgent component for subsection", () => {
      const styledSubsection = styleSubsection(mockNonUrgentSubsection, 1);
      render(styledSubsection);

      const text = screen.getByText(
        "This is a styled paragraph non-urgent subsection",
      );
      const heading = screen.getByRole("heading", {
        level: 3,
        name: "Heading for Non Urgent Component",
      });

      expect(text).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
    });
  });
  describe("styleSection", () => {
    it("should display several subsections of a concrete vaccine in one section", () => {
      const mockSection: VaccinePageSection = {
        headline: "This is a heading",
        subsections: [mockMarkdownSubsection, mockNonUrgentSubsection],
      };

      const styledSection: StyledPageSection = styleSection(mockSection);
      render(styledSection.component);

      const text1: HTMLElement = screen.getByText(
        "This is a styled paragraph markdown subsection",
      );
      const text2: HTMLElement = screen.getByText(
        "This is a styled paragraph non-urgent subsection",
      );

      expect(styledSection.heading).toEqual(mockSection.headline);
      expect(text1).toBeInTheDocument();
      expect(text2).toBeInTheDocument();
    });
  });

  describe("getStyledContentForVaccine", () => {
    it("should return styled content for a specific vaccine", async () => {
      const mockWhatSection: VaccinePageSection = {
        headline: "What Vaccine Is For",
        subsections: [mockMarkdownSubsection, mockNonUrgentSubsection],
      };
      const mockWhoSection: VaccinePageSection = {
        headline: "Who is this Vaccine For",
        subsections: [mockMarkdownSubsection, mockNonUrgentSubsection],
      };
      const mockHowSection: VaccinePageSection = {
        headline: "How to get this Vaccine",
        subsections: [mockMarkdownSubsection, mockNonUrgentSubsection],
      };
      const mockContent: VaccinePageContent = {
        overview: "This is an overview",
        whatVaccineIsFor: mockWhatSection,
        whoVaccineIsFor: mockWhoSection,
        howToGetVaccine: mockHowSection,
        webpageLink: "This is a link",
      };

      (getFilteredContentForVaccine as jest.Mock).mockResolvedValue(
        mockContent,
      );

      const styledVaccineContent: StyledVaccineContent =
        await getStyledContentForVaccine(VaccineTypes.RSV);

      expect(styledVaccineContent).not.toBeNull();
      expect(styledVaccineContent.overview).toEqual("This is an overview");
      expect(styledVaccineContent.whatVaccineIsFor.heading).toEqual(
        "What Vaccine Is For",
      );
      expect(styledVaccineContent.whoVaccineIsFor.heading).toEqual(
        "Who is this Vaccine For",
      );
      expect(styledVaccineContent.howToGetVaccine.heading).toEqual(
        "How to get this Vaccine",
      );
      expect(
        isValidElement(styledVaccineContent.whatVaccineIsFor.component),
      ).toBe(true);
      expect(
        isValidElement(styledVaccineContent.whoVaccineIsFor.component),
      ).toBe(true);
      expect(
        isValidElement(styledVaccineContent.howToGetVaccine.component),
      ).toBe(true);
      expect(styledVaccineContent.webpageLink).toEqual("This is a link");
    });
  });
});
