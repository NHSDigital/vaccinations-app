import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/services/content-api/contentFilter");
jest.mock("@src/app/_components/vaccine/vaccine", () => jest.fn(() => <div />));

describe("RSV vaccine page", () => {
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

    const vaccineRsvPage = await VaccineRsv();
    render(vaccineRsvPage);

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });

    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain vaccine component", async () => {
    const vaccineRsvPage = await VaccineRsv();
    render(vaccineRsvPage);

    expect(Vaccine).toHaveBeenCalledWith(
      {
        name: "RSV",
        vaccine: VaccineTypes.RSV,
      },
      undefined,
    );
  });
});
