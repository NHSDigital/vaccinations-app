import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import {
  getPageCopyForVaccine,
  VaccinePageContent,
} from "@src/services/content-api/contentFilter";
import { VaccineTypes } from "@src/models/vaccine";
import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import { act } from "react";

jest.mock("@src/services/content-api/contentFilter");

describe("Any vaccine page", () => {
  const mockContent = {
    overview: "Overview text",
    whatVaccineIsFor: {
      heading: "what-heading",
      text: "<p data-testid='what-text-paragraph'>what-text</p>",
    },
    whoVaccineIsFor: {
      heading: "who-heading",
      text: "<p data-testid='who-text-paragraph'>who-text</p>",
    },
    howToGetVaccine: {
      heading: "how-heading",
      text: "<p data-testid='how-text-paragraph'>how-text</p>",
    },
    webpageLink: "https://www.test.com/",
  };
  const mockVaccineName = "Test-Name";
  let contentPromise: Promise<VaccinePageContent>;

  beforeEach(() => {
    (getPageCopyForVaccine as jest.Mock).mockResolvedValue(mockContent);
    contentPromise = getPageCopyForVaccine(VaccineTypes.SIX_IN_ONE);
  });

  const renderVaccinePage = async () => {
    await act(async () => {
      render(
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine name={mockVaccineName} vaccine={VaccineTypes.SIX_IN_ONE} />
        </VaccineContentProvider>,
      );
    });
  };

  it("should contain overview text", async () => {
    await renderVaccinePage();
    const overviewBlock = screen.getByText("Overview text");
    expect(overviewBlock).toBeInTheDocument();
  });

  it("should contain whatItIsFor expander block", async () => {
    await renderVaccinePage();

    const whatItIsForHeading = screen.getByText("what-heading");
    const whatItIsForText = screen.getByTestId("what-text-paragraph");

    expect(whatItIsForHeading).toBeInTheDocument();
    expect(whatItIsForText).toBeInTheDocument();
    expect(whatItIsForText).toHaveTextContent("what-text");
  });

  it("should contain whoVaccineIsFor expander block", async () => {
    await renderVaccinePage();

    const whoVaccineIsForHeading = screen.getByText("who-heading");
    const whoVaccineIsForText = screen.getByTestId("who-text-paragraph");

    expect(whoVaccineIsForHeading).toBeInTheDocument();
    expect(whoVaccineIsForText).toBeInTheDocument();
    expect(whoVaccineIsForText).toHaveTextContent("who-text");
  });

  it("should contain howToGetVaccine expander block", async () => {
    await renderVaccinePage();

    const howToGetVaccineHeading = screen.getByText("how-heading");
    const howToGetVaccineText = screen.getByTestId("how-text-paragraph");

    expect(howToGetVaccineHeading).toBeInTheDocument();
    expect(howToGetVaccineText).toBeInTheDocument();
    expect(howToGetVaccineText).toHaveTextContent("how-text");
  });

  it("should contain webpage link", async () => {
    await renderVaccinePage();

    const webpageLink = screen.getByRole("link", {
      name: `Find out more about ${mockVaccineName} vaccination on the NHS.uk`,
    });

    expect(webpageLink).toBeInTheDocument();
    expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
  });
});
