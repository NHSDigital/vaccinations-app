import {
  styleSection,
  styleSubsection,
} from "@src/services/content-api/contentStylingService";
import { render, screen } from "@testing-library/react";
import { expect } from "@jest/globals";
import { VaccinePageSection } from "@src/services/content-api/contentFilterSpike";
import { JSX } from "react";

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
        headline: "",
        subsections: [mockMarkdownSubsection, mockNonUrgentSubsection],
      };

      const styledSection: JSX.Element = styleSection(mockSection);
      render(styledSection);

      const heading: HTMLElement = screen.getByRole("heading", {
        name: "Headline",
      });
      const text1: HTMLElement = screen.getByText(
        "This is a styled paragraph markdown subsection",
      );
      const text2: HTMLElement = screen.getByText(
        "This is a styled paragraph non-urgent subsection",
      );

      expect(heading).toBeInTheDocument();
      expect(text1).toBeInTheDocument();
      expect(text2).toBeInTheDocument();
    });
  });
});
