import VaccinationsHub from "@src/app/check-and-book-vaccinations/page";
import { SERVICE_HEADING } from "@src/app/constants";
import { render, screen } from "@testing-library/react";

describe("Vaccination Hub Page", () => {
  beforeEach(async () => {
    render(VaccinationsHub());
  });

  it("renders heading", async () => {
    expectHeadingToBeRendered();
  });
});

const expectHeadingToBeRendered = () => {
  expect(queryHeading(SERVICE_HEADING, 1)).toBeVisible();
};

const queryHeading = (text: string, level: number): HTMLElement | null => {
  return screen.queryByRole("heading", {
    name: text,
    level: level,
  });
};
