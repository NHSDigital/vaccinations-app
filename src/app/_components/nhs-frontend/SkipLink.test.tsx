import SkipLink from "@src/app/_components/nhs-frontend/SkipLink";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

describe("SkipLink component", () => {
  beforeEach(() => {
    // Add a mock <h1> to the document for the component to target
    const heading = document.createElement("h1");
    heading.textContent = "Main Content";
    document.body.appendChild(heading);
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = "";
  });

  it("renders the skip link", () => {
    render(<SkipLink />);
    expect(screen.getByText("Skip to main content")).toBeInstanceOf(HTMLAnchorElement);
  });

  it("focuses the first h1 and sets tabindex on click", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to main content");
    const heading = document.querySelector("h1");

    // Spy on focus method
    const focusSpy = jest.spyOn(heading!, "focus");

    fireEvent.click(link);

    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(focusSpy).toHaveBeenCalled();
  });
});
