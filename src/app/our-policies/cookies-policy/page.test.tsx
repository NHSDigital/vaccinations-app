import { render, screen, within } from "@testing-library/react";

import CookiesPolicy from "../../our-policies/cookies-policy/page";

jest.mock("@src/app/_components/nhs-frontend/BackLink", () => jest.fn(() => <div data-testid="back-link"></div>));

describe("CookiesPolicy Component", () => {
  it("renders Cookies page", () => {
    render(<CookiesPolicy />);
    const title: HTMLElement = screen.getByRole("heading", { level: 1, name: "Cookies" });

    expect(title).toBeVisible();
  });

  it("displays contents list", () => {
    render(<CookiesPolicy />);
    const firstContentLink: HTMLElement = screen.getAllByText("Summary")[0];
    const secondContentLink: HTMLElement = screen.getAllByText("Strictly necessary cookies")[0];
    const thirdContentLink: HTMLElement = screen.getAllByText("Changes to our cookies policy")[0];

    expect(firstContentLink).toBeVisible();
    expect(secondContentLink).toBeVisible();
    expect(thirdContentLink).toBeVisible();
  });

  it("displays Summary heading and its text", () => {
    render(<CookiesPolicy />);

    const heading: HTMLElement = screen.getByRole("heading", { level: 2, name: "Summary" });
    const firstParagraph1: HTMLElement = screen.getByText("NHS England (“we” or “us”) uses cookies to deliver", {
      exact: false,
    });
    const firstParagraph2: HTMLElement = screen.getByText(/should be read alongside it./i);
    const secondParagraph: HTMLElement = screen.getByText(
      "We put small files called cookies onto your device, like your mobile phone or computer. Cookies are widely used to make websites and apps work, or work more efficiently, as well as to provide services and functionalities for users.",
    );
    const thirdParagraph: HTMLElement = screen.getByText(
      "Cookies fall into 2 categories, strictly necessary cookies and optional cookies.",
    );
    const forthParagraph: HTMLElement = screen.getByText("We only put:");

    expect(heading).toBeVisible();
    expect(firstParagraph1).toBeVisible();
    expect(firstParagraph2).toBeVisible();
    expect(secondParagraph).toBeVisible();
    expect(thirdParagraph).toBeVisible();
    expect(forthParagraph).toBeVisible();
  });

  it("displays list in the Summary text", () => {
    render(<CookiesPolicy />);

    const list: HTMLElement = screen.getByRole("list", { name: "list of cookies" }); // check spaces if they work in accessibility
    const { getAllByRole } = within(list);
    const items: HTMLElement[] = getAllByRole("listitem");

    expect(list).toBeVisible();
    expect(items.length).toBe(1);
  });

  it("has a correct link to privacy policy in Summary", () => {
    render(<CookiesPolicy />);
    const link: HTMLElement = screen.getByRole("link", { name: "privacy policy" });

    expect(link).toHaveAttribute(
      "href",
      "https://www.england.nhs.uk/contact-us/privacy-notice/national-flu-vaccination-programme/",
    );
  });

  it("displays Strictly necessary cookies heading", () => {
    render(<CookiesPolicy />);
    const heading: HTMLElement = screen.getByRole("heading", { level: 2, name: "Strictly necessary cookies" });

    expect(heading).toBeVisible();
  });

  it("displays expandable Details with table", () => {
    render(<CookiesPolicy />);
    const details: HTMLElement = screen.getByText("List of necessary cookies that make this service work");
    const table: HTMLElement = screen.getByRole("columnheader", { name: "Purpose" });

    expect(details).toBeVisible();
    expect(table).toBeInTheDocument();
  });

  it("displays Changes to cookies heading", () => {
    render(<CookiesPolicy />);
    const heading: HTMLElement = screen.getByRole("heading", { level: 2, name: "Changes to our cookies policy" });

    expect(heading).toBeVisible();
  });

  it("displays Changes to cookies paragraph", () => {
    render(<CookiesPolicy />);
    const paragraph: HTMLElement = screen.getByText(
      "Our cookie policy may change. The latest version of our cookie policy will be accessible through this service. We will inform you if we make any material changes to our cookies policy or privacy notice. This will allow you to refresh your consent if you wish to continue using this service.",
    );

    expect(paragraph).toBeVisible();
  });
});
