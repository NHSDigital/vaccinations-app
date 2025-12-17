import { AtRiskHubContent } from "@src/app/_components/hub/AtRiskHubContent";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/hub/AtRiskText", () => ({
  AtRiskText: jest.fn().mockImplementation(() => <p data-testid={"at-risk-text"}>At risk hub content test</p>),
}));

describe("At risk hub content", () => {
  beforeEach(() => {
    render(AtRiskHubContent());
  });

  it("should render heading as h2", () => {
    const atRiskHeading: HTMLElement = getHeading("Recommended vaccines for at-risk groups", 2);
    expect(atRiskHeading).toBeVisible();
  });

  it("should include at risk text content", () => {
    const atRiskText: HTMLElement = screen.getByTestId("at-risk-text");

    expect(atRiskText).toBeInTheDocument();
  });
});

const getHeading = (text: string, level: number): HTMLElement => {
  return screen.getByRole("heading", {
    name: text,
    level: level,
  });
};
