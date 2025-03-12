import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import { getContentForVaccine } from "@src/services/content-api/contentService";

jest.mock("@src/services/content-api/contentService");

describe("6-in-1 vaccine page", () => {
  const mockDescription = "mock description";

  beforeEach(() => {
    const mockContent = {
      description: mockDescription,
    };
    (getContentForVaccine as jest.Mock).mockResolvedValue(mockContent);
  });

  it("should contain back link to vaccination schedule page", async () => {
    const pathToSchedulePage = "/schedule";

    const vaccine6in1Page = await Vaccine6in1();
    render(vaccine6in1Page);

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });

    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain overview text", () => {});
});
