import { render, screen } from "@testing-library/react";
import VaccineFlu from "@src/app/vaccines/flu/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine");

describe("Flu vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain back link to vaccination schedule page", () => {
      const pathToSchedulePage = "/schedule";

      render(VaccineFlu());

      const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });

      expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
    });

    it("should contain vaccine component", () => {
      render(VaccineFlu());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.FLU,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with errors", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(() => {
        throw new Error("mocked error: content load fail");
      });
    });

    it("should display error page", () => {
      render(VaccineFlu());

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(errorHeading).toBeInTheDocument();
    });
  });
});
