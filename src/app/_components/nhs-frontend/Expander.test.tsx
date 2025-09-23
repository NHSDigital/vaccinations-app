import Expander from "@src/app/_components/nhs-frontend/Expander";
import { render, screen } from "@testing-library/react";

describe("Expander Component", () => {
  it("renders expandable section by default", () => {
    render(<Expander title={"title"} component={<div>subsection</div>} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders non expandable section correctly", () => {
    render(<Expander title={"title"} component={<p>test</p>} notExpandable={true} />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "title" })).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
