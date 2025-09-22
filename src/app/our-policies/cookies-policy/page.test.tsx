import { render, screen, within } from "@testing-library/react";

import CookiesPolicy from "../../our-policies/cookies-policy/page";

jest.mock("@src/app/_components/nhs-frontend/BackLink", () => jest.fn(() => <div data-testid="back-link"></div>));

describe("CookiesPolicy Component", () => {
  it("renders Cookies policy page", () => {
    render(<CookiesPolicy />);
    expect(screen.getByRole("heading", { level: 1, name: "Cookies" })).toBeInTheDocument();
  });

  it("displays Summary heading and its text", () => {
    render(<CookiesPolicy />);

    expect(screen.getByRole("heading", { level: 2, name: "Summary" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "NHS England (“we” or “us”) uses cookies to deliver this service. The information set out in this policy is provided in addition to our",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("and should be read alongside it.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We put small files called cookies onto your device, like your mobile phone or computer. Cookies are widely used to make websites and apps work, or work more efficiently, as well as to provide services and functionalities for users.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cookies fall into 2 categories, strictly necessary cookies and optional cookies."),
    ).toBeInTheDocument();
    expect(screen.getByText("We only put:")).toBeInTheDocument();
  });

  it("displays list in the Summary text", () => {
    render(<CookiesPolicy />);

    const list: HTMLElement = screen.getByRole("list", { name: "what-cookies" });
    const { getAllByRole } = within(list);
    const items: HTMLElement[] = getAllByRole("listitem");

    expect(list).toBeInTheDocument();
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
});
