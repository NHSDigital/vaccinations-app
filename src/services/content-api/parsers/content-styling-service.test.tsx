import { VaccineTypes } from "@src/models/vaccine";
import {
  extractHeadingAndContent,
  getStyledContentForVaccine,
  styleSection,
  styleSubsection,
} from "@src/services/content-api/parsers/content-styling-service";
import {
  HeadingWithContent,
  StyledPageSection,
  StyledVaccineContent,
  VaccinePageContent,
  VaccinePageSection,
  VaccinePageSubsection,
} from "@src/services/content-api/types";
import { render, screen } from "@testing-library/react";
import { isValidElement, JSX } from "react";

describe("ContentStylingService", () => {
  const mockMarkdownSubsection: VaccinePageSubsection = {
    type: "simpleElement",
    text: "<h2>This is a styled paragraph markdown subsection</h2>",
    name: "markdown",
    headline: "Headline",
  };

  const mockRsvMarkdownSubsection: VaccinePageSubsection = {
    type: "simpleElement",
    text: "<p>para</p><h3>If you're aged 75 to 79</h3><p>para1</p><p>para2</p><h3>If you're pregnant</h3><p>para3</p><p>para4</p>",
    name: "markdown",
    headline: "Headline",
  };

  const mockNonUrgentSubsection: VaccinePageSubsection = {
    type: "simpleElement",
    text: "<h3>Heading for Non Urgent Component</h3><p>This is a styled paragraph non-urgent subsection</p>",
    name: "non-urgent",
    headline: "",
  };

  const mockTableSubsection: VaccinePageSubsection = {
    type: "tableElement",
    mainEntity:
      "<table><tr><th>Name</th><th>Age</th></tr><tr><td>Jane Smith</td><td>35</td></tr></table>",
    name: "Table",
  };

  const mockCalloutSubsection: VaccinePageSubsection = {
    type: "simpleElement",
    text: "<h3>Heading for callout</h3><p>This is a styled paragraph callout subsection</p>",
    name: "Callout",
    headline: "",
  };

  describe("styleSubsection", () => {
    it("should return styled markdown component for subsection beginning with headline", async () => {
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
        const mockMarkdownSubsection: VaccinePageSubsection = {
          type: "simpleElement",
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

    it("should return styled information component for subsection", async () => {
      const mockInformationSubsection: VaccinePageSubsection = {
        type: "simpleElement",
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

    it("should return styled non-urgent component for subsection", async () => {
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

    it("should return table component for subsection", async () => {
      const styledSubsection: JSX.Element = styleSubsection(
        mockTableSubsection,
        1,
      );
      render(styledSubsection);

      const column1: HTMLElement = screen.getByText("Name");
      const column2: HTMLElement = screen.getByText("Age");
      const raw1: HTMLElement = screen.getByText("Jane Smith");
      const raw2: HTMLElement = screen.getByText("35");

      expect(column1).toBeInTheDocument();
      expect(column2).toBeInTheDocument();
      expect(raw1).toBeInTheDocument();
      expect(raw2).toBeInTheDocument();
    });

    it("should return styled callout component for subsection", async () => {
      const styledSubsection: JSX.Element = styleSubsection(
        mockCalloutSubsection,
        1,
      );
      render(styledSubsection);

      const text: HTMLElement = screen.getByText(
        "This is a styled paragraph callout subsection",
      );
      const heading: HTMLElement = screen.getByText("Heading for callout");
      const warningCallout: HTMLElement = screen.getByText("Important:");

      expect(text).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(warningCallout).toBeInTheDocument();
    });
  });

  describe("styleSection", () => {
    it("should display several subsections of a concrete vaccine in one section", async () => {
      const mockSection: VaccinePageSection = {
        headline: "This is a heading",
        subsections: [
          mockMarkdownSubsection,
          mockNonUrgentSubsection,
          mockTableSubsection,
        ],
      };

      const styledSection: StyledPageSection = styleSection(mockSection);
      render(styledSection.component);

      const markdownSubsection: HTMLElement = screen.getByText(
        "This is a styled paragraph markdown subsection",
      );
      const nonUrgentSubsection: HTMLElement = screen.getByText(
        "This is a styled paragraph non-urgent subsection",
      );

      const columnOfTable: HTMLElement = screen.getByText("Name");

      expect(styledSection.heading).toEqual(mockSection.headline);
      expect(markdownSubsection).toBeInTheDocument();
      expect(nonUrgentSubsection).toBeInTheDocument();
      expect(columnOfTable).toBeInTheDocument();
    });
  });

  describe("getStyledContentForVaccine", () => {
    it.each([VaccineTypes.RSV, VaccineTypes.RSV_PREGNANCY])(
      "should return styled content for %s",
      async (vaccine: VaccineTypes) => {
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
          subsections: [mockRsvMarkdownSubsection],
        };
        const mockContent: VaccinePageContent = {
          overview: "This is an overview",
          whatVaccineIsFor: mockWhatSection,
          whoVaccineIsFor: mockWhoSection,
          howToGetVaccine: mockHowSection,
          webpageLink: "This is a link",
        };

        const styledVaccineContent: StyledVaccineContent =
          await getStyledContentForVaccine(vaccine, mockContent);

        expect(styledVaccineContent).not.toBeNull();
        expect(styledVaccineContent.overview).toEqual("This is an overview");
        expect(styledVaccineContent.whatVaccineIsFor?.heading).toEqual(
          "What Vaccine Is For",
        );
        expect(styledVaccineContent.whoVaccineIsFor.heading).toEqual(
          "Who is this Vaccine For",
        );
        expect(styledVaccineContent.howToGetVaccine.heading).toEqual(
          "How to get this Vaccine",
        );

        const expectedRsvSection = "<div><p>para1</p><p>para2</p></div>";
        const expectedRsvPregnancySection = `<div><div><p>para3</p><p>para4</p></div><p>In some areas you can also <a href="/api/sso-to-nbs?vaccine=rsv-pregnancy" target="_blank" rel="noopener">book an RSV vaccination in a pharmacy</a>.</p></div>`;
        const { container } = render(
          styledVaccineContent.howToGetVaccine.component,
        );
        if (vaccine === VaccineTypes.RSV) {
          expect(container).toContainHTML(expectedRsvSection);
        }
        if (vaccine === VaccineTypes.RSV_PREGNANCY) {
          expect(container.innerHTML).toBe(expectedRsvPregnancySection);
        }

        expect(
          isValidElement(styledVaccineContent.whatVaccineIsFor?.component),
        ).toBe(true);
        expect(
          isValidElement(styledVaccineContent.whoVaccineIsFor.component),
        ).toBe(true);
        expect(
          isValidElement(styledVaccineContent.howToGetVaccine.component),
        ).toBe(true);
        expect(styledVaccineContent.webpageLink).toEqual("This is a link");
      },
    );

    it("should return styled content without what-section when what-section is missing", async () => {
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
        whoVaccineIsFor: mockWhoSection,
        howToGetVaccine: mockHowSection,
        webpageLink: "This is a link",
      };

      const styledVaccineContent: StyledVaccineContent =
        await getStyledContentForVaccine(VaccineTypes.RSV, mockContent);

      expect(styledVaccineContent).not.toBeNull();
      expect(styledVaccineContent.overview).toEqual("This is an overview");
      expect(styledVaccineContent.whatVaccineIsFor).toBeUndefined();
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
    it("should extract heading and content from more complex non-urgent html string", async () => {
      const headingAndContent: HeadingWithContent = extractHeadingAndContent(
        "<h3>Heading</h3><div><ul><li>you have not been contacted</li></ul></div>",
      );

      expect(headingAndContent.heading).toEqual("Heading");
      expect(headingAndContent.content).toEqual(
        "<div><ul><li>you have not been contacted</li></ul></div>",
      );
    });

    it("should extract heading and content from simple non-urgent html string", async () => {
      const headingAndContent: HeadingWithContent = extractHeadingAndContent(
        "<h3>Heading</h3><p>you have not been contacted</p>",
      );

      expect(headingAndContent.heading).toEqual("Heading");
      expect(headingAndContent.content).toEqual(
        "<p>you have not been contacted</p>",
      );
    });

    it("should return empty heading and content from empty string", async () => {
      const headingAndContent: HeadingWithContent =
        extractHeadingAndContent("");

      expect(headingAndContent.heading).toEqual("");
      expect(headingAndContent.content).toEqual("");
    });

    it("should return content as is, and empty heading from string that does not begin with h3 tags", async () => {
      const headingAndContent: HeadingWithContent = extractHeadingAndContent(
        "<p>Some content<h3>Heading</h3></p>",
      );

      expect(headingAndContent.heading).toEqual("");
      expect(headingAndContent.content).toEqual(
        "<p>Some content<h3>Heading</h3></p>",
      );
    });
  });
});
