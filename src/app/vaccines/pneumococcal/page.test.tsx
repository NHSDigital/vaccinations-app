import { render, screen } from "@testing-library/react";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";
import VaccinePneumococcal from "@src/app/vaccines/pneumococcal/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine");
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("Pneumococcal vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain back link", () => {
      render(VaccinePneumococcal());

      const backLink = screen.getByTestId("back-link");
      expect(backLink).toBeInTheDocument();
    });

    it("should contain vaccine component", () => {
      render(VaccinePneumococcal());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.PNEUMOCOCCAL,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with unnhandled error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(
        () => new Error("mocked error: content load fail"),
      );
    });

    it("should display error page", () => {
      render(VaccinePneumococcal());

      const pneumococcalHeading = screen.getByRole("heading", {
        level: 1,
        name: "Pneumococcal vaccine",
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(pneumococcalHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
