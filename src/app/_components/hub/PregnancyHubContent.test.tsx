import { PregnancyHubContent } from "@src/app/_components/hub/PregnancyHubContent";
import { render, screen } from "@testing-library/react";

describe("Pregnancy hub content", () => {
  beforeEach(() => {
    render(<PregnancyHubContent />);
  });

  it("renders subheading about pregnancy", () => {
    const subheading: HTMLElement = getHeading("Routine vaccines for pregnancy", 2);
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
});

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
