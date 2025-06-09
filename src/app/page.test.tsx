import { render, screen } from "@testing-library/react";
import VaccinationsHub from "@src/app/page";
import { JSX } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@src/services/content-api/gateway/content-reader-service");

describe("Vaccination Hub Page", () => {
  beforeEach(() => {
    const VaccinationsHubPage: JSX.Element = VaccinationsHub();
    render(VaccinationsHubPage);
  });

  it("renders heading", async () => {
    const heading: HTMLElement = screen.getByRole("heading", {
      name: "Check and book an RSV vaccination",
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders RSV vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "RSV for older adults",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/rsv");
  });

  it("renders RSV in pregnancy vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "RSV vaccine in pregnancy",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/rsv-pregnancy");
  });
});
