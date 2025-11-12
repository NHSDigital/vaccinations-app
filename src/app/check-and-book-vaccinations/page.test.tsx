import VaccinationsHub from "@src/app/check-and-book-vaccinations/page";
import { SERVICE_HEADING } from "@src/app/constants";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/nhs-app/BackToNHSAppLink");

describe("Vaccination Hub Page", () => {
  beforeEach(async () => {
    render(<VaccinationsHub />);
  });

  it("renders heading", async () => {
    expectHeadingToBeRendered();
  });

  it("renders  vaccines for all ages button", async () => {
    const button = screen.getByRole("link", { name: "View vaccines for all ages" });
    expect(button).toBeVisible();
    expect(button).toHaveAttribute("href", "/vaccines-for-all-ages");
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
