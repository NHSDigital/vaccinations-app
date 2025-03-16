import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";

jest.mock("@src/services/content-api/contentFilter");
jest.mock("@src/app/_components/vaccine/vaccine", () => jest.fn(() => <div />));

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
});
