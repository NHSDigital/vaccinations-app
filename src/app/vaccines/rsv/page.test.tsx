import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/contentStylingService";

jest.mock("@src/services/content-api/contentStylingService.tsx");
jest.mock("@src/app/_components/vaccine/vaccine", () => jest.fn(() => <div />));

describe("RSV vaccine page", () => {
  const mockStyledContent: StyledVaccineContent = {
    overview: "Overview text",
    whatVaccineIsFor: {
      heading: "what-heading",
      component: <p>What Section styled component</p>,
    },
    whoVaccineIsFor: {
      heading: "who-heading",
      component: <h2>Who Section styled component</h2>,
    },
    howToGetVaccine: {
      heading: "how-heading",
      component: <div>How Section styled component</div>,
    },
    webpageLink: "https://www.test.com/",
  };

  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
  });

  it("should contain back link to vaccination schedule page", () => {
    const pathToSchedulePage = "/schedule";

    render(VaccineRsv());

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });

    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain vaccine component", () => {
    render(VaccineRsv());

    expect(Vaccine).toHaveBeenCalledWith(
      {
        name: "RSV",
        vaccine: VaccineTypes.RSV,
      },
      undefined,
    );
  });
});
