import VaccinationsHub from "@src/app/check-and-book-vaccinations/page";
import { SERVICE_HEADING } from "@src/app/constants";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/nhs-app/BackToNHSAppLink");

describe("Vaccination Hub Page", () => {
  beforeEach(async () => {
    render(<VaccinationsHub />);
  });

  it("renders main heading", async () => {
    expectHeadingToBeRendered();
  });

  it("renders subheading about pregnancy", () => {
    const subheading: HTMLElement = getHeading("Vaccines if you're pregnant", 2);
    expect(subheading).toBeVisible();
  });

  it("renders subtext about pregnancy", () => {
    const subtext: HTMLElement = screen.getByText(
      "Some vaccines are recommended during pregnancy to protect the health of you and your baby.",
    );
    expect(subtext).toBeVisible();
  });

  it("renders vaccines during pregnancy card link", async () => {
    expectLinkToBeRendered("Vaccines during pregnancy", "/vaccines-during-pregnancy");
  });

  it("renders vaccines for all ages button", async () => {
    expectLinkToBeRendered("View vaccines for all ages", "/vaccines-for-all-ages");
  });
});

const expectHeadingToBeRendered = () => {
  expect(getHeading(SERVICE_HEADING, 1)).toBeVisible();
};

const expectLinkToBeRendered = (text: string, href: string) => {
  const link: HTMLElement = screen.getByRole("link", { name: text });
  expect(link).toBeVisible();
  expect(link).toHaveAttribute("href", href);
};

const getHeading = (text: string, level: number): HTMLElement => {
  return screen.getByRole("heading", {
    name: text,
    level: level,
  });
};
