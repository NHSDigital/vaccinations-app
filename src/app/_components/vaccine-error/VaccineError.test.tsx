import { render, screen } from "@testing-library/react";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

describe("VaccineError", () => {
  it.each([VaccineTypes.FLU, VaccineTypes.RSV, VaccineTypes.SIX_IN_ONE])(
    `should display vaccine name in error heading`,
    (vaccineType: VaccineTypes) => {
      render(VaccineError({ vaccineType: vaccineType }));

      const heading: HTMLElement = screen.getByRole("heading", {
        level: 1,
        name: `${VaccineInfo[vaccineType].displayName.capitalised} vaccine`,
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
      /Sorry, there is a problem showing vaccine/,
    );

    expect(text).toBeInTheDocument();
  });

  it("renders link in error text", async () => {
    render(VaccineError({ vaccineType: VaccineTypes.FLU }));

    const link: HTMLElement = screen.getByRole("link", {
      name: "vaccinations on NHS.uk",
    });

    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toEqual(
      "https://www.nhs.uk/vaccinations/",
    );
  });
});
