import { render, screen } from "@testing-library/react";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { VaccineTypes } from "@src/models/vaccine";
import VaccineShingles from "@src/app/vaccines/shingles/page";
import { assertBackLinkIsPresent } from "@test-data/test-helpers-back-link";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/app/_components/vaccine/Vaccine");
jest.mock("@src/app/_components/nhs-frontend/BackLink", () =>
  jest.fn(() => <div data-testid="back-link"></div>),
);

describe("Shingles vaccine page", () => {
  describe("when content loaded successfully", () => {
    beforeEach(() => {
      (getContentForVaccine as jest.Mock).mockResolvedValue({
        styledVaccineContent: mockStyledContent,
      });
      (Vaccine as jest.Mock).mockImplementation(() => <div />);
    });

    it("should contain back link", () => {
      render(VaccineShingles());

      assertBackLinkIsPresent(screen);
    });

    it("should contain vaccine component", () => {
      render(VaccineShingles());

      expect(Vaccine).toHaveBeenCalledWith(
        {
          vaccineType: VaccineTypes.SHINGLES,
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
      render(VaccineShingles());

      const shinglesHeading = screen.getByRole("heading", {
        level: 1,
        name: "Shingles vaccine",
      });

      const errorHeading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(shinglesHeading).toBeInTheDocument();
      expect(errorHeading).toBeInTheDocument();
    });
  });
});
