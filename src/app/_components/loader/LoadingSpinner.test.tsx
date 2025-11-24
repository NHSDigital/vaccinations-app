import { render, screen } from "@testing-library/react";

import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders the loader container", () => {
    render(<LoadingSpinner />);
    const container: HTMLElement = screen.getByTestId("loader-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the spinner SVG", () => {
    render(<LoadingSpinner />);
    const svg: HTMLElement = screen.getByTestId("loader-spinner");
    expect(svg).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<LoadingSpinner />);
    const container: HTMLElement = screen.getByTestId("loader-container");

    expect(container.className).toContain("loaderContainer");
    expect(container.className).toContain("loaderContainerMiddle");
  });
});
