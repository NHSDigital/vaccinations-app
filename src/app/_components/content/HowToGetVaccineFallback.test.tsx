
// TODO: VIA-331 review placement of logic to generate different how to get link
import { VaccineTypes } from "@src/models/vaccine";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { HowToGetVaccineFallback } from "@src/app/_components/content/HowToGetVaccineFallback";

it("should include 'how to get' link with url from vaccineInfo config ", async () => {
  const vaccineType = VaccineTypes.RSV;

  // const expectedHowToGetWhenContentIsDown: React.JSX.Element = (
  //   <p>
  //     Find out <a href={VaccineInfo[vaccineType].nhsHowToGetWebpageLink.href}>how to get</a> an {VaccineInfo[vaccineType].displayName.midSentenceCase}{" "}
  //     vaccination
  //   </p>
  // );
  render(<HowToGetVaccineFallback vaccineType={vaccineType}/>);

  const fallbackHowToGetLink: HTMLElement = screen.getByRole("link", { name: "how to get" });
  expect(fallbackHowToGetLink).toBeInTheDocument();
  expect(fallbackHowToGetLink).toHaveAttribute(
    "href",
    "https://www.nhs.uk/vaccinations/rsv-vaccine/#how-to-get-it"
  );

  // todo: how to assert on this content if broken up by variable injection?
  const fallbackVaccineText: HTMLElement = screen.getByText("Find out how to get an RSV vaccination.");
  expect(fallbackVaccineText).toBeInTheDocument();
});
