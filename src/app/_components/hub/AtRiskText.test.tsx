import { AtRiskText } from "@src/app/_components/hub/AtRiskText";
import { render, screen } from "@testing-library/react";

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
    const descriptionTextBelow1: HTMLElement = screen.getAllByText(/Speak to your GP or/i)[1];
    const descriptionTextBelow2: HTMLElement = screen.getAllByText(/about what vaccinations you might need./i)[0];

    expect(heading).toBeVisible();
    expect(descriptionTextBelow1).toBeVisible();
    expect(descriptionTextBelow2).toBeVisible();
  });

  it("should display longterm health conditions heading and its description", () => {
    render(<AtRiskText />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Long-term health conditions", level: 3 });
    const descriptionTextBelow1: HTMLElement = screen.getAllByText(/Speak to your GP or/i)[1];
    const descriptionTextBelow2: HTMLElement = screen.getAllByText(/about what vaccinations you might need./i)[0];

    expect(heading).toBeVisible();
    expect(descriptionTextBelow1).toBeVisible();
    expect(descriptionTextBelow2).toBeVisible();
  });

  it("should display pharmacy as clickable link", () => {
    render(<AtRiskText />);

    const webpageLink: HTMLElement = screen.getByRole("link", {
      name: "pharmacy",
    });

    expect(webpageLink).toBeVisible();
    expect(webpageLink).toHaveAttribute("href", "https://www.nhs.uk/service-search/pharmacy/find-a-pharmacy/");
    expect(webpageLink).toHaveAttribute("target", "_blank");
    expect(webpageLink).toHaveAttribute("rel", "noopener");
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
