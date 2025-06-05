import { render, screen } from "@testing-library/react";
import VaccinationsHub from "./page";
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

  it("renders all headings", async () => {
    const headings: HTMLElement[] = screen.getAllByRole("heading", {
      name: "Vaccinations",
    });

    expect(headings.length).toBe(2);
  });

  it("renders the text below heading", async () => {
    const heading: HTMLElement = screen.getByText(
      "Find out about vaccinations for babies, " +
        "children and adults, including why they're important and how to get them.",
    );

    expect(heading).toBeInTheDocument();
  });

  it("renders View all vaccinations link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "View all vaccinations",
    });

    expect(link).toBeInTheDocument();
  });

  it("renders the text below 2nd heading", async () => {
    const heading: HTMLElement = screen.getByText(
      "Based on your age, these vaccinations may be relevant - some" +
        " vaccinations may not be needed or have already been given.",
    );

    expect(heading).toBeInTheDocument();
  });

  it("renders COVID-19 vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", { name: "COVID-19" });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/covid-19");
  });

  it("renders Flu vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", { name: "Flu" });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/flu");
  });

  it("renders MenACWY vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "MenACWY",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/menacwy");
  });

  it("renders Pneumococcal vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "Pneumococcal",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/pneumococcal");
  });

  it("renders RSV vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", { name: "RSV" });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/rsv");
  });

  it("renders RSV in pregnancy vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "RSV in pregnancy",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/rsv-pregnancy");
  });

  it("renders Shingles vaccine link", async () => {
    const link: HTMLElement = screen.getByRole("link", {
      name: "Shingles",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("/vaccines/shingles");
  });
});
