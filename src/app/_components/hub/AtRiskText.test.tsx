import { useNavigationTransition } from "@src/app/_components/context/NavigationContext";
import { AtRiskText } from "@src/app/_components/hub/AtRiskText";
import { render, screen, within } from "@testing-library/react";

jest.mock("@src/app/_components/context/NavigationContext", () => ({
  useNavigationTransition: jest.fn(),
}));

(useNavigationTransition as jest.Mock).mockReturnValue({
  navigate: jest.fn(),
  isPending: false,
});

describe("AtRiskText", () => {
  it("should display upper text", () => {
    render(<AtRiskText />);

    const upperText: HTMLElement = screen.getByText("There are additional vaccines available for some people.");

    expect(upperText).toBeVisible();
  });

  it("should display at-risk babies heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "At-risk babies and children", level: 3 });
    const descriptionTextBelow: HTMLElement = screen.getByText("Speak to your GP or health visitor.");

    expect(heading).toBeVisible();
    expect(descriptionTextBelow).toBeVisible();
  });

  it("should display longterm health conditions heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Long-term health conditions", level: 3 });
    const descriptionTextBelow1: HTMLElement = screen.getByText(
      /People with certain long-term health conditions or receiving certain/i,
    );
    const descriptionTextBelow2: HTMLElement = screen.getAllByText(/about what vaccinations you might need./i)[0];

    expect(heading).toBeVisible();
    expect(descriptionTextBelow1).toBeVisible();
    expect(descriptionTextBelow2).toBeVisible();
  });

  it.each([
    { text: "pharmacy", link: "https://www.nhs.uk/service-search/pharmacy/find-a-pharmacy/" },
    { text: "flu vaccine", link: "/vaccines/flu-vaccine" },
    { text: "COVID-19 vaccine", link: "/vaccines/covid-19-vaccine" },
  ])(`should display longterm health conditions with clickable link ($text)`, ({ text, link }) => {
    render(<AtRiskText />);

    const heading = screen.getByRole("heading", { name: "Long-term health conditions" });
    const sectionContainer = heading.nextElementSibling!;

    const webpageLink: HTMLElement = within(sectionContainer as HTMLElement).getByRole("link", {
      name: text,
    });

    expect(webpageLink).toBeVisible();
    expect(webpageLink).toHaveAttribute("href", link);
  });

  it("should display carers heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Carers", level: 3 });
    const sectionContainer = heading.nextElementSibling!;

    const descriptionTextBelow: HTMLElement = within(sectionContainer as HTMLElement).getByText(
      /is recommended if you are the main carer for an older or disabled person/i,
    );
    const webpageLink: HTMLElement = within(sectionContainer as HTMLElement).getByRole("link", { name: "flu vaccine" });

    expect(heading).toBeVisible();
    expect(descriptionTextBelow).toBeVisible();
    expect(webpageLink).toBeVisible();
    expect(webpageLink).toHaveAttribute("href", "/vaccines/flu-vaccine");
  });

  it("should display Care homes for older adults heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Care homes for older adults", level: 3 });
    const descriptionTextBelow: HTMLElement = screen.getByText(/Speak to your GP or a member of staff where/i);

    expect(heading).toBeVisible();
    expect(descriptionTextBelow).toBeVisible();
  });

  it("should display sexual health heading and its link in the text below", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Long-term health conditions", level: 3 });
    const webpageLink: HTMLElement = screen.getByRole("link", {
      name: "sexual health clinic",
    });

    expect(heading).toBeVisible();
    expect(webpageLink).toBeVisible();
    expect(webpageLink).toHaveAttribute(
      "href",
      "https://www.nhs.uk/nhs-services/sexual-health-services/find-a-sexual-health-clinic/",
    );
    expect(webpageLink).toHaveAttribute("target", "_blank");
    expect(webpageLink).toHaveAttribute("rel", "noopener");
  });

  it("should display Travel heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Travel", level: 3 });
    const descriptionTextBelow: HTMLElement = screen.getByText(/you may need to be vaccinated against/i);

    expect(heading).toBeVisible();
    expect(descriptionTextBelow).toBeVisible();
  });

  it("should display travel outside the UK as clickable link", () => {
    render(<AtRiskText />);

    const webpageLink: HTMLElement = screen.getByRole("link", {
      name: "travel outside the UK",
    });

    expect(webpageLink).toBeVisible();
    expect(webpageLink).toHaveAttribute("href", "https://www.nhs.uk/vaccinations/travel-vaccinations/");
    expect(webpageLink).toHaveAttribute("target", "_blank");
    expect(webpageLink).toHaveAttribute("rel", "noopener");
  });

  it("should display Occupation heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Occupation", level: 3 });
    const descriptionTextBelow: HTMLElement = screen.getByText(
      /Check with your employer about what vaccinations you might need./i,
    );

    expect(heading).toBeVisible();
    expect(descriptionTextBelow).toBeVisible();
  });
});
