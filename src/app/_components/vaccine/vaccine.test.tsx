import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/contentStylingService";

jest.mock("@src/services/content-api/contentStylingService.tsx");

describe("Any vaccine page", () => {
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
  const mockVaccineName = "Test-Name";

  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
  });

  it("should contain overview text", async () => {
    const vaccinePage = await Vaccine({
      name: mockVaccineName,
      vaccine: VaccineTypes.RSV,
    });
    render(vaccinePage);

    const overviewBlock = screen.getByText("Overview text");

    expect(overviewBlock).toBeInTheDocument();
  });

  it("should contain whatItIsFor expander block", async () => {
    const vaccinePage = await Vaccine({
      name: mockVaccineName,
      vaccine: VaccineTypes.RSV,
    });
    render(vaccinePage);

    const heading = screen.getByText("what-heading");
    const content = screen.getByText("What Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain whoVaccineIsFor expander block", async () => {
    const vaccinePage = await Vaccine({
      name: mockVaccineName,
      vaccine: VaccineTypes.RSV,
    });
    render(vaccinePage);

    const heading = screen.getByText("who-heading");
    const content = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain howToGetVaccine expander block", async () => {
    const vaccinePage = await Vaccine({
      name: mockVaccineName,
      vaccine: VaccineTypes.RSV,
    });
    render(vaccinePage);

    const heading = screen.getByText("how-heading");
    const content = screen.getByText("How Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain webpage link", async () => {
    const vaccinePage = await Vaccine({
      name: mockVaccineName,
      vaccine: VaccineTypes.RSV,
    });
    render(vaccinePage);

    const webpageLink = screen.getByRole("link", {
      name: `Find out more about ${mockVaccineName} vaccination on the NHS.uk`,
    });

    expect(webpageLink).toBeInTheDocument();
    expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
  });
});
