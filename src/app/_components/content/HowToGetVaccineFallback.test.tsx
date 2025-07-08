import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";
import { VaccineTypes } from "@src/models/vaccine";
import { render, screen } from "@testing-library/react";
import React from "react";

it("should include 'how to get' link with url from vaccineInfo config ", async () => {
  const vaccineType = VaccineTypes.RSV;

  render(<HowToGetVaccineFallback vaccineType={vaccineType} />);

  const fallbackHowToGetLink: HTMLElement = screen.getByRole("link", { name: "how to get" });
  expect(fallbackHowToGetLink).toBeInTheDocument();
  expect(fallbackHowToGetLink).toHaveAttribute("href", "https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it");

  const fallbackVaccineText: HTMLElement = screen.getByRole("paragraph");
  expect(fallbackVaccineText.innerHTML).toContain("an RSV vaccination");
});
