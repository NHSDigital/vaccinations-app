import ActionLink from "@src/app/_components/nhs-frontend/ActionLink";
import { render, screen } from "@testing-library/react";

describe("ActionLink Component", () => {
  it("renders properly", () => {
    render(<ActionLink url={"https://example.com/sausages/"} displayText={"Sausages"} />);

    expect(screen.getByRole("link", { name: "Sausages" })).toHaveAttribute("href", "https://example.com/sausages/");
  });
});
