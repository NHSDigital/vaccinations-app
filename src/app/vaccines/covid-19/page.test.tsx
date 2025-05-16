import { render, screen } from "@testing-library/react";
import VaccineCovid19 from "@src/app/vaccines/covid-19/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("COVID-19 vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain back link", () => {
      render(VaccineCovid19());

      const backLink = screen.getByTestId("back-link");
      expect(backLink).toBeInTheDocument();
    });

    it("should contain vaccine component", () => {
      render(VaccineCovid19());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.COVID_19,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with unhandled error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(() => {
        throw new Error("mocked error: content load fail");
      });
    });

    it("should display error page", () => {
      render(VaccineCovid19());

      const covid19Heading = screen.getByRole("heading", {
        level: 1,
        name: `COVID-19 vaccine`,
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(covid19Heading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
