import ContentsList from "@src/app/_components/nhs-frontend/ContentsList";
import { render, screen } from "@testing-library/react";

describe("ContentsList component", () => {
  it("displays list of contents", () => {
    render(<ContentsList contents={["Summary", "Strictly necessary cookies", "Changes to our cookies policy"]} />);
    const firstContentLink: HTMLElement = screen.getByText("Summary");
    const secondContentLink: HTMLElement = screen.getByText("Strictly necessary cookies");
    const thirdContentLink: HTMLElement = screen.getByText("Changes to our cookies policy");

    expect(firstContentLink).toBeVisible();
    expect(secondContentLink).toBeVisible();
    expect(thirdContentLink).toBeVisible();
  });
});
