import Recommendation from "@src/app/_components/content/Recommendation";
import { mockStyledContent, mockStyledContentWithoutRecommendation } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("Recommendation component", () => {
  it("renders correctly", () => {
    render(<Recommendation recommendation={mockStyledContent.recommendation} />);

    const recommendationHeading: HTMLElement = screen.getByRole("heading", {
      name: "Non-urgent advice: Recommendation Heading",
      level: 2,
    });

    expect(recommendationHeading).toBeInTheDocument();
  });

  it("does not render if no recommendation is present", () => {
    render(<Recommendation recommendation={mockStyledContentWithoutRecommendation.recommendation} />);

    const recommendationHeading: HTMLElement | null = screen.queryByRole("heading", {
      name: "Non-urgent advice: Recommendation Heading",
      level: 2,
    });

    expect(recommendationHeading).not.toBeInTheDocument();
  });
});
