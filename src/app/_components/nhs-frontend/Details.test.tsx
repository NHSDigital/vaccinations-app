import Details from "@src/app/_components/nhs-frontend/Details";
import { render, screen } from "@testing-library/react";

describe("Details Component", () => {
  it("renders expandable section by default", () => {
    render(<Details title={"title"} component={<div>subsection</div>} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders non expandable section correctly", () => {
    render(<Details title={"title"} component={<p>test</p>} notExpandable={true} />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "title" })).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
