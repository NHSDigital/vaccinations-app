import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/contentStylingService";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/services/content-api/contentStylingService.tsx");
jest.mock("@src/app/_components/vaccine/vaccine", () => jest.fn(() => <div />));

describe("6-in-1 vaccine page", () => {
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

  it("should contain back link to vaccination schedule page", async () => {
    const pathToSchedulePage = "/schedule";

    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });
    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain vaccine component", async () => {
    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    expect(Vaccine).toHaveBeenCalledWith(
      {
        name: "6-in-1",
        vaccine: VaccineTypes.SIX_IN_ONE,
      },
      undefined,
    );
  });
});
