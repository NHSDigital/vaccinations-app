import CardLinkWithDescription from "@src/app/_components/nhs-app/CardLinkWithDescription";
import { render, screen } from "@testing-library/react";

describe("CardLinkWithDescription", () => {
  it("should render component", () => {
    render(<CardLinkWithDescription title="Flu" description="Around 12 weeks" link="/vaccines/flu" />);

    const oneOfCards = screen.getByRole("listitem");

    expect(oneOfCards).toBeVisible();
  });

  it("should render link inside of card link", () => {
    render(<CardLinkWithDescription title="Flu" description="Around 12 weeks" link="/vaccines/flu" />);

    const cardLinkWithDescription: HTMLElement = screen.getByRole("link", { name: "Flu" });

    expect(cardLinkWithDescription).toBeVisible();
  });

  it("should render description inside of card link", () => {
    render(<CardLinkWithDescription title="Flu" description="Around 12 weeks" link="/vaccines/flu" />);

    const content: HTMLElement = screen.getByText("Around 12 weeks");

    expect(content).toBeVisible();
  });
});
