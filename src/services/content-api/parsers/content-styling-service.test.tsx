import { render, screen } from "@testing-library/react";
import { VaccineTypes } from "@src/models/vaccine";
import { isValidElement, JSX } from "react";
import {
  extractHeadingAndContent,
  getStyledContentForVaccine,
  NonUrgentContent,
  StyledPageSection,
  StyledVaccineContent,
  styleSection,
  styleSubsection,
} from "@src/services/content-api/parsers/content-styling-service";
import {
  VaccinePageContent,
  VaccinePageSection
} from "@src/services/content-api/parsers/content-filter-service";

describe("ContentStylingService", () => {
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
      const styledSubsection: JSX.Element | undefined = styleSubsection(
        mockMarkdownSubsection,
        1,
      );
      render(styledSubsection);

      const heading1: HTMLElement = screen.getByRole("heading", {
        name: "Headline",
      });
      const heading2: HTMLElement = screen.getByRole("heading", {
        name: "This is a styled paragraph markdown subsection",
      });
      expect(heading1).toBeInTheDocument();
      expect(heading2).toBeInTheDocument();
    });

    it.each(["markdown", "default"])(
      "should return styled %s component for subsection",
      () => {
        const mockMarkdownSubsection = {
          text: "<div role='section'>This is a styled paragraph markdown subsection</div>",
          name: "%s",
          headline: "",
        };

        const styledSubsection: JSX.Element | undefined = styleSubsection(
          mockMarkdownSubsection,
          1,
        );
        render(styledSubsection);

        const div: HTMLElement = screen.getByRole("section");

        expect(div).toBeInTheDocument();
        expect(div.textContent).toEqual(
          "This is a styled paragraph markdown subsection",
        );
        expect(div.className).toEqual("");
      },
    );

    it("should return styled information component for subsection", () => {
      const mockInformationSubsection = {
        text: "<p>This is a styled paragraph information subsection</p>",
        name: "Information",
        headline: "",
      };

      const styledSubsection: JSX.Element = styleSubsection(
        mockInformationSubsection,
        1,
      );
      render(styledSubsection);

      const text: HTMLElement = screen.getByText(
        "This is a styled paragraph information subsection",
      );
      const information: HTMLElement = screen.getByText("Information:");

      expect(information).toBeInTheDocument();
      expect(information.className).toEqual("nhsuk-u-visually-hidden");
      expect(text).toBeInTheDocument();
    });

    it("should return styled non-urgent component for subsection", () => {
      const styledSubsection: JSX.Element = styleSubsection(
        mockNonUrgentSubsection,
        1,
      );
      render(styledSubsection);

      const text: HTMLElement = screen.getByText(
        "This is a styled paragraph non-urgent subsection",
      );
      const heading: HTMLElement = screen.getByText(
        "Heading for Non Urgent Component",
      );
      const nonUrgent: HTMLElement = screen.getByText("Non-urgent advice:");

      expect(text).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(nonUrgent).toBeInTheDocument();
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

      const styledVaccineContent: StyledVaccineContent =
        await getStyledContentForVaccine(VaccineTypes.RSV, mockContent);

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

  describe("extractHeadingAndContent", () => {
    it("should extract heading and content from non-urgent html string", () => {
      const headingAndContent: NonUrgentContent = extractHeadingAndContent(
        "<h3>Heading</h3><div><ul><li>you have not been contacted</li></ul></div>",
      );

      expect(headingAndContent.heading).toEqual("Heading");
      expect(headingAndContent.content).toEqual(
        "<div><ul><li>you have not been contacted</li></ul></div>",
      );
    });

    it("should extract heading and content from non-urgent html string", () => {
      const headingAndContent: NonUrgentContent = extractHeadingAndContent(
        "<h3>Heading</h3><p>you have not been contacted</p>",
      );

      expect(headingAndContent.heading).toEqual("Heading");
      expect(headingAndContent.content).toEqual(
        "<p>you have not been contacted</p>",
      );
    });

    it("should return empty heading and content from empty string", () => {
      const headingAndContent: NonUrgentContent = extractHeadingAndContent("");

      expect(headingAndContent.heading).toEqual("");
      expect(headingAndContent.content).toEqual("");
    });

    it("should return content as is, and empty heading from string that does not begin with h3 tags", () => {
      const headingAndContent: NonUrgentContent = extractHeadingAndContent(
        "<p>Some content<h3>Heading</h3></p>",
      );

      expect(headingAndContent.heading).toEqual("");
      expect(headingAndContent.content).toEqual(
        "<p>Some content<h3>Heading</h3></p>",
      );
    });
  });
});
