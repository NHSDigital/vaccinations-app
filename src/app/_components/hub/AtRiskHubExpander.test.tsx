import { AtRiskHubExpander } from "@src/app/_components/hub/AtRiskHubExpander";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/hub/AtRiskText", () => ({
  AtRiskText: jest.fn().mockImplementation(() => <p data-testid={"at-risk-text"}>At risk hub content test</p>),
}));

describe("At risk hub expander", () => {
  beforeEach(() => {
    render(AtRiskHubExpander());
  });

  it("should render heading as h2", () => {
    const atRiskHeading: HTMLElement = getHeading("Who should get extra vaccines?", 2);
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
