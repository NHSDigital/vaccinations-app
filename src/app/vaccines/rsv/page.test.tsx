import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));

describe("RSV vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        () => mockStyledContent,
      );
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
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
        },
        undefined,
      );
    });
  });
});
