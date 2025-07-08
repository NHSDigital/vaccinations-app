import { FindOutMoreLink } from "@src/app/_components/content/FindOutMore";
import { VaccineTypes } from "@src/models/vaccine";
import { randomURL } from "@test-data/meta-builder";
import { render, screen } from "@testing-library/react";
import React from "react";

it("should include 'how to get' link with url from vaccineInfo config ", async () => {
  const findOutMoreUrl = randomURL();
  const vaccineType = VaccineTypes.RSV;

  render(<FindOutMoreLink findOutMoreUrl={findOutMoreUrl} vaccineType={vaccineType} />);

  const findOutMoreLink: HTMLElement = screen.getByRole("link", { name: "Find out more about the RSV vaccine" });
  expect(findOutMoreLink).toBeInTheDocument();
  expect(findOutMoreLink).toHaveAttribute("href", findOutMoreUrl.href);
});
