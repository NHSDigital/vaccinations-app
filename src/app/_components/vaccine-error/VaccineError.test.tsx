import VaccineError from "@src/app/_components/vaccine-error/VaccineError";
import { render, screen } from "@testing-library/react";

describe("VaccineError", () => {
  it("should display subheading", async () => {
    render(<VaccineError />);

    const subheading: HTMLElement = screen.getByRole("heading", {
      level: 2,
      name: "Vaccine content is unavailable",
    });

    expect(subheading).toBeInTheDocument();
  });

  it("should display error text", async () => {
    render(<VaccineError />);

    const text: HTMLElement = screen.getByText(/Sorry, there is a problem showing vaccine/);

    expect(text).toBeInTheDocument();
  });

  it("renders link in error text", async () => {
    render(<VaccineError />);

    const link: HTMLElement = screen.getByRole("link", {
      name: "vaccinations on NHS.uk",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual("https://www.nhs.uk/vaccinations/");
  });
});
