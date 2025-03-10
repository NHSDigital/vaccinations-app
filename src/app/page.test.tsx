import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import VaccinationsHub from "./page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<VaccinationsHub />);

    const heading = screen.getByRole("heading", { name: "Vaccinations hub" });

    expect(heading).toBeInTheDocument();
  });
});
