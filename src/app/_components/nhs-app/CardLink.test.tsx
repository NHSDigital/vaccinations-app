import { useNavigationTransition } from "@src/app/_components/context/NavigationContext";
import CardLink from "@src/app/_components/nhs-app/CardLink";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/context/NavigationContext", () => ({
  useNavigationTransition: jest.fn(),
}));

(useNavigationTransition as jest.Mock).mockReturnValue({
  navigate: jest.fn(),
  isPending: false,
});

describe("CardLink", () => {
  it("should render component", () => {
    render(<CardLink title="Flu" link="/vaccines/flu" />);

    const oneOfCards = screen.getByRole("listitem");

    expect(oneOfCards).toBeVisible();
  });

  it("should render link inside of card link", () => {
    render(<CardLink title="Flu" link="/vaccines/flu" />);

    const cardLinkWithDescription: HTMLElement = screen.getByRole("link", { name: "Flu" });

    expect(cardLinkWithDescription).toBeVisible();
  });
});
