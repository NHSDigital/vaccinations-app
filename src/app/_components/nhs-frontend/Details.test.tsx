import Details from "@src/app/_components/nhs-frontend/Details";
import { render, screen } from "@testing-library/react";

describe("Details Component", () => {
  it("renders expandable section correctly", () => {
    render(<Details title={"title"} component={<p>test</p>} />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
