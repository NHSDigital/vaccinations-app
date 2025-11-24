import VaccinesDuringPregnancy from "@src/app/vaccines-during-pregnancy/page";
import { assertBackLinkIsPresent } from "@test-data/utils/back-link-helpers";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/nhs-frontend/BackLink", () => jest.fn(() => <div data-testid="back-link"></div>));

describe("VaccinesDuringPregnancy", () => {
  const vaccines = [
    {
      name: "Whooping cough (Pertussis)",
      description: "Around 20 weeks",
      link: "/vaccines/whooping-cough-vaccination",
    },
    { name: "RSV in pregnancy", description: "From 28 weeks", link: "/vaccines/rsv-pregnancy" },
  ];

  it("should render heading", () => {
    render(<VaccinesDuringPregnancy />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Vaccines during pregnancy", level: 1 });

    expect(heading).toBeVisible();
  });

  it("should render back link", () => {
    render(<VaccinesDuringPregnancy />);

    assertBackLinkIsPresent(screen);
  });

  it.each(vaccines)(`should render card link with description for $name`, ({ name, description, link }) => {
    render(<VaccinesDuringPregnancy />);

    const cardLink: HTMLElement = screen.getByRole("link", { name });
    const cardDescription: HTMLElement = screen.getByText(description);

    expect(cardLink).toBeVisible();
    expect(cardLink.getAttribute("href")).toEqual(link);
    expect(cardDescription).toBeVisible();
  });

  it("renders vaccines for all ages button", async () => {
    render(<VaccinesDuringPregnancy />);
    expectLinkToBeRendered("View vaccines for all ages", "/vaccines-for-all-ages");
  });
});

const expectLinkToBeRendered = (text: string, href: string) => {
  const link: HTMLElement = screen.getByRole("link", { name: text });
  expect(link).toBeVisible();
  expect(link).toHaveAttribute("href", href);
};
