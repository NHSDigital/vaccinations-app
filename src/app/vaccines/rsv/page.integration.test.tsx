import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import { getStyledContentForVaccine } from "@src/services/content-api/contentStylingService";
import { mockStyledContent } from "@test-data/content-api/data";
import { act } from "react";

jest.mock("@src/services/content-api/contentStylingService.tsx");

describe("RSV vaccine page", () => {
  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
  });

  it("should contain page content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineRsv());
    });

    const rsvHeading: HTMLElement = screen.getByRole("heading", {
      level: 1,
      name: `RSV vaccine`,
    });
    expect(rsvHeading).toBeInTheDocument();
  });
});
