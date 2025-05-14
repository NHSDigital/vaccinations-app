import { render, screen } from "@testing-library/react";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";
import VaccineMenACWY from "@src/app/vaccines/menacwy/page";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine");

describe("MenACWY vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain vaccine component", () => {
      render(VaccineMenACWY());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.MENACWY,
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
      render(VaccineMenACWY());

      const menacwyHeading = screen.getByRole("heading", {
        level: 1,
        name: "MenACWY vaccine",
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(menacwyHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
