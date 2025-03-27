import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import { getStyledContentForVaccine } from "@src/services/content-api/contentStylingService";
import { mockStyledContent } from "@test-data/content-api/data";
import { act } from "react";

jest.mock("@src/services/content-api/contentStylingService.tsx");

describe("6-in-1 vaccine page - integration test", () => {
  beforeEach(() => {
    (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
  });

  it("should display 6-in-1 content from embedded vaccine component", async () => {
    await act(async () => {
      render(Vaccine6in1());
    });

    const sixInOneHeading: HTMLElement = screen.getByRole("heading", {
      level: 1,
      name: `6-in-1 vaccine`,
    });
    expect(sixInOneHeading).toBeInTheDocument();
  });
});
