import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import { getStyledContentForVaccine } from "@src/services/content-api/parsers/content-styling-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { act } from "react";

jest.mock("@src/services/content-api/parsers/content-styling-service.tsx");

describe("RSV vaccine page - integration test", () => {
  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
  });

  it("should display RSV content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineRsv());
    });

    const rsvHeading: HTMLElement = screen.getByRole("heading", {
      level: 1,
      name: `RSV vaccine`,
    });
    expect(rsvHeading).toBeInTheDocument();
    expect(screen.getByTestId("overview-text")).toHaveTextContent(
      mockStyledContent.overview,
    );
  });
});
