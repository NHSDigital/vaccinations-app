import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/contentStylingService";
import Vaccine from "@src/app/_components/vaccine/vaccine";
import { mockStyledContent } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/parsers/contentStylingService.tsx");
jest.mock("@src/app/_components/vaccine/vaccine", () => jest.fn(() => <div />));

describe("6-in-1 vaccine page", () => {
  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
  });

  it("should contain back link to vaccination schedule page", () => {
    const pathToSchedulePage = "/schedule";

    render(Vaccine6in1());

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });
    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain vaccine component", () => {
    render(Vaccine6in1());

    expect(Vaccine).toHaveBeenCalledWith(
      {
        name: "6-in-1",
      },
      undefined,
    );
  });
});
