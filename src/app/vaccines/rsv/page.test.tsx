import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));

describe("RSV vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain vaccine component", () => {
      render(VaccineRsv());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.RSV,
        },
        undefined,
      );
    });
  });

  describe("when content fails to load with unhandled error", () => {
    beforeEach(() => {
      (Vaccine as jest.Mock).mockImplementation(
        () => new Error("mocked error: content load fail"),
      );
    });

    it("should display error page", () => {
      render(VaccineRsv());

      const rsvHeading = screen.getByRole("heading", {
        level: 1,
        name: `RSV vaccine`,
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(rsvHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
