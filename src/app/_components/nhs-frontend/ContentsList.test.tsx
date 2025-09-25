import ContentsList from "@src/app/_components/nhs-frontend/ContentsList";
import { render, screen } from "@testing-library/react";

describe("ContentsList component", () => {
  it("displays list of contents", () => {
    const urlsWithContents: Record<string, string>[] = [
      { summary: "Summary" },
      { "necessary-cookies": "Strictly necessary cookies" },
      { changes: "Changes to our cookies policy" },
    ];
    render(<ContentsList urlsWithContents={urlsWithContents} />);
    const firstContentLink: HTMLElement = screen.getByRole("link", { name: "Summary" });
    const secondContentLink: HTMLElement = screen.getByRole("link", { name: "Strictly necessary cookies" });
    const thirdContentLink: HTMLElement = screen.getByRole("link", { name: "Changes to our cookies policy" });

    expect(firstContentLink).toBeVisible();
    expect(secondContentLink).toBeVisible();
    expect(thirdContentLink).toBeVisible();
  });

  it("has correct link on content item", () => {
    const urlsWithContents: Record<string, string>[] = [{ summary: "Summary" }];
    render(<ContentsList urlsWithContents={urlsWithContents} />);

    const contentLink: HTMLElement = screen.getByRole("link", { name: "Summary" });

    expect(contentLink).toHaveAttribute("href", "#summary");
  });
});
