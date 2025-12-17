import { MoreInformation } from "@src/app/_components/content/MoreInformation";
import { VaccineType } from "@src/models/vaccine";
import { mockStyledContent, mockStyledContentWithoutWhatSection } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";

describe("MoreInformation component for COVID", () => {
  const covid19VaccineType: VaccineType = VaccineType.COVID_19;

  it("should not show how-to-get expander section when campaign is active", async () => {
    render(
      <MoreInformation
        styledVaccineContent={mockStyledContent}
        vaccineType={covid19VaccineType}
        isCampaignActive={true}
      />,
    );

    // COVID-19 vaccine content (active campaign)
    expectExpanderBlockToNotBePresent("How to get the vaccine", "How Section styled component");
  });

  it("should show how-to-get expander section when campaign is inactive", async () => {
    render(
      <MoreInformation
        styledVaccineContent={mockStyledContent}
        vaccineType={covid19VaccineType}
        isCampaignActive={false}
      />,
    );

    // COVID-19 vaccine content (closed campaign)
    expectExpanderBlockToBePresent("How to get the vaccine", "How Section styled component");
  });
});

describe("MoreInformation component ", () => {

  describe("When vaccineInfo.moreInformationHeadersFromContentApi=false", () => {
    it("should display whatItIsFor expander block", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("What the vaccine is for", "What Section styled component");
    });

    it("should display whoVaccineIsFor expander block", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("Who should have the vaccine", "Who Section styled component");
    });

    it("should display howToGet expander block", async () => {
      const vaccineType = VaccineType.TD_IPV_3_IN_1;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("How to get the vaccine", "How Section styled component");
    });

    it("should display vaccineSideEffects expander block", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("Side effects of the vaccine", "Side effects section styled component");
    });
  });

  describe("When vaccineInfo.moreInformationHeadersFromContentApi=true", () => {
    it("should display whatItIsFor expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("what-heading", "What Section styled component");
    });

    it("should display whoVaccineIsFor expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("who-heading", "Who Section styled component");
    });

    it("should display howToGet expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("how-heading", "How Section styled component");
    });

    it("should display vaccineSideEffects expander block", async () => {
      const vaccineType = VaccineType.FLU_IN_PREGNANCY;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("side-effects-heading", "Side effects section styled component");
    });
  });

  describe("For RSV and RSV in pregnancy", () => {
    it("should not include 'how to get' section for RSV_PREGNANCY ", async () => {
      const vaccineType = VaccineType.RSV_PREGNANCY;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      const heading: HTMLElement | null = screen.queryByText("How to get the vaccine");

      expect(heading).not.toBeInTheDocument();
    });

    it("should not include 'how to get' section for RSV ", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      const heading: HTMLElement | null = screen.queryByText("How to get the vaccine");

      expect(heading).not.toBeInTheDocument();
    });

    it("should display webpage link to more information about vaccine", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContent} vaccineType={vaccineType} />);

      const webpageLink: HTMLElement = screen.getByRole("link", {
        name: "Find out more about the RSV vaccine",
      });

      expect(webpageLink).toBeInTheDocument();
      expect(webpageLink).toHaveAttribute("href", "https://test.example.com/");
      expect(webpageLink).toHaveAttribute("target", "_blank");
    });

    it("should not display whatItIsFor section if undefined in content", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContentWithoutWhatSection} vaccineType={vaccineType} />);

      const whatItIsForHeading: HTMLElement | null = screen.queryByText("What the vaccine is for");
      const whatItIsForContent: HTMLElement | null = screen.queryByText("What Section styled component");

      expect(whatItIsForHeading).not.toBeInTheDocument();
      expect(whatItIsForContent).not.toBeInTheDocument();
    });

    it("should display whoVaccineIsFor section even if whatItIsFor is undefined in content", async () => {
      const vaccineType = VaccineType.RSV;
      render(<MoreInformation styledVaccineContent={mockStyledContentWithoutWhatSection} vaccineType={vaccineType} />);

      expectExpanderBlockToBePresent("Who should have the vaccine", "Who Section styled component");
    });
  });
});

const expectExpanderBlockToBePresent = (expanderHeading: string, expanderContent: string) => {
  const heading: HTMLElement = screen.getByText(expanderHeading);
  const content: HTMLElement = screen.getByText(expanderContent);

  expect(heading).toBeInTheDocument();
  expect(content).toBeInTheDocument();
};

const expectExpanderBlockToNotBePresent = (expanderHeading: string, expanderContent: string) => {
  expect(screen.queryByText(expanderHeading)).toBeNull();
  expect(screen.queryByText(expanderContent)).toBeNull();
};
