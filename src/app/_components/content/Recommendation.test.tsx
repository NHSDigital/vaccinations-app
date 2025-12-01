import Recommendation from "@src/app/_components/content/Recommendation";
import { mockStyledContent, mockStyledContentWithoutRecommendation } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Recommendation component", () => {
  it("renders correctly", () => {
    render(<Recommendation styledVaccineContent={mockStyledContent} />);

    const RecommendationText: HTMLElement = screen.getByTestId("recommendation");

    expect(RecommendationText).toBeInTheDocument();
  });

  it("does not render if no recommendation present", () => {
    render(<Recommendation styledVaccineContent={mockStyledContentWithoutRecommendation} />);

    const RecommendationText: HTMLElement | null = screen.queryByTestId("Recommendation component");

    expect(RecommendationText).not.toBeInTheDocument();
  });
});
