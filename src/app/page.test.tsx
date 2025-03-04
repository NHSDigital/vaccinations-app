import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import Home from "./page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { name: "Vaccinations" });

    expect(heading).toBeInTheDocument();
  });
});
