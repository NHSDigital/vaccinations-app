import { render, screen } from "@testing-library/react";
import { VaccineInfo, VaccineTypes } from "@src/models/vaccine";
import VaccineError from "@src/app/_components/vaccine-error/VaccineError";

describe("VaccineError", () => {
  const allVaccineTypes = Object.values(VaccineTypes) as VaccineTypes[];

  it.each(allVaccineTypes)(
    `should display vaccine name in error heading for %s`,
    (vaccineType: VaccineTypes) => {
      render(VaccineError({ vaccineType: vaccineType }));

      const heading: HTMLElement = screen.getByRole("heading", {
        level: 1,
        name: `${VaccineInfo[vaccineType].displayName.capitalised} vaccine`,
      });

      expect(heading).toBeInTheDocument();
    },
  );

  it.each(allVaccineTypes)(
    "should display subheading for %s",
    (vaccineType: VaccineTypes) => {
      render(VaccineError({ vaccineType: vaccineType }));

      const subheading: HTMLElement = screen.getByRole("heading", {
        level: 2,
        name: "Vaccine content is unavailable",
      });

      expect(subheading).toBeInTheDocument();
    },
  );

  it.each(allVaccineTypes)(
    "should display error text for %s",
    (vaccineType: VaccineTypes) => {
      render(VaccineError({ vaccineType: vaccineType }));

      const text: HTMLElement = screen.getByText(
        /Sorry, there is a problem showing vaccine/,
      );

      expect(text).toBeInTheDocument();
    },
  );

  it.each(allVaccineTypes)(
    "renders link in error text for %s",
    async (vaccineType: VaccineTypes) => {
      render(VaccineError({ vaccineType: vaccineType }));

      const link: HTMLElement = screen.getByRole("link", {
        name: "vaccinations on NHS.uk",
      });

      expect(link).toBeInTheDocument();
      expect(link.getAttribute("href")).toEqual(
        "https://www.nhs.uk/vaccinations/",
      );
    },
  );
});
