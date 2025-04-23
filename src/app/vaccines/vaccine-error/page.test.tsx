import { render, screen } from "@testing-library/react";
import VaccineError from "@src/app/vaccines/vaccine-error/page";
import { VaccineDisplayNames, VaccineTypes } from "@src/models/vaccine";

describe("VaccineError", () => {
  it("should display back button", () => {
    const pathToSchedulePage: string = "/schedule";

    render(VaccineError({ vaccineType: VaccineTypes.FLU }));

    const linkToSchedulePage: HTMLElement = screen.getByRole("link", {
      name: "Go back",
    });
    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it.each([VaccineTypes.FLU, VaccineTypes.RSV, VaccineTypes.SIX_IN_ONE])(
    `should display vaccine name in error heading`,
    (vaccineType: VaccineTypes) => {
      render(VaccineError({ vaccineType: vaccineType }));

      const heading: HTMLElement = screen.getByRole("heading", {
        level: 1,
        name: `${VaccineDisplayNames[vaccineType]} vaccine`,
      });

      expect(heading).toBeInTheDocument();
    },
  );

  it("should display subheading", () => {
    render(VaccineError({ vaccineType: VaccineTypes.FLU }));

    const subheading: HTMLElement = screen.getByRole("heading", {
      level: 2,
      name: "Vaccine content is unavailable",
    });

    expect(subheading).toBeInTheDocument();
  });

  it("should display error text", () => {
    render(VaccineError({ vaccineType: VaccineTypes.FLU }));

    const text: HTMLElement = screen.getByText(
      "Sorry, there is a problem showing vaccine information. Come back later, or read about vaccinations on NHS.uk.",
    );

    expect(text).toBeInTheDocument();
  });
});
