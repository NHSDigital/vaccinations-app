import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { getStyledContentForVaccine } from "@src/services/content-api/contentStylingService";
import { mockStyledContent } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/contentStylingService.tsx");
jest.mock("@src/app/_components/vaccine/vaccine", () => jest.fn(() => <div />));

describe("RSV vaccine page", () => {
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
