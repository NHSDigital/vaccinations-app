import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";

jest.mock("@src/services/content-api/contentFilter");

describe("6-in-1 vaccine page", () => {
  const mockContent = {
    overview: "Overview text",
    whatVaccineIsFor: {
      heading: "what-heading",
      bodyText: "<p data-testid='what-text-paragraph'>what-text</p>",
    },
    whoVaccineIsFor: {
      heading: "who-heading",
      bodyText: "<p data-testid='who-text-paragraph'>who-text</p>",
    },
    howToGetVaccine: {
      heading: "how-heading",
      bodyText: "<p data-testid='how-text-paragraph'>how-text</p>",
    },
    webpageLink: "https://www.test.com/",
  };

  beforeEach(() => {
    (getPageCopyForVaccine as jest.Mock).mockResolvedValue(mockContent);
  });

  it("should contain back link to vaccination schedule page", async () => {
    const pathToSchedulePage = "/schedule";

    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });

    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain overview text", async () => {
    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const overviewBlock = screen.getByText("Overview text");

    expect(overviewBlock).toBeInTheDocument();
  });

  it("should contain whatItIsFor expander block", async () => {
    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const whatItIsForHeading = screen.getByText("what-heading");
    const whatItIsForText = screen.getByTestId("what-text-paragraph");

    expect(whatItIsForHeading).toBeInTheDocument();
    expect(whatItIsForText).toBeInTheDocument();
    expect(whatItIsForText).toHaveTextContent("what-text");
  });

  it("should contain whoVaccineIsFor expander block", async () => {
    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const whoVaccineIsForHeading = screen.getByText("who-heading");
    const whoVaccineIsForText = screen.getByTestId("who-text-paragraph");

    expect(whoVaccineIsForHeading).toBeInTheDocument();
    expect(whoVaccineIsForText).toBeInTheDocument();
    expect(whoVaccineIsForText).toHaveTextContent("who-text");
  });

  it("should contain howToGetVaccine expander block", async () => {
    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const howToGetVaccineHeading = screen.getByText("how-heading");
    const howToGetVaccineText = screen.getByTestId("how-text-paragraph");

    expect(howToGetVaccineHeading).toBeInTheDocument();
    expect(howToGetVaccineText).toBeInTheDocument();
    expect(howToGetVaccineText).toHaveTextContent("how-text");
  });

  it("should contain webpage link", async () => {
    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const webpageLink = screen.getByRole("link", {
      name: "Find out more about 6-in-1 vaccination on the NHS.uk",
    });

    expect(webpageLink).toBeInTheDocument();
    expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
  });
});
