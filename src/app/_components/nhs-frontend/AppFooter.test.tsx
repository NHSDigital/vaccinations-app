import AppFooter from "@src/app/_components/nhs-frontend/AppFooter";
import { render, screen } from "@testing-library/react";

describe("AppFooter", () => {
  it("renders crown copyright", async () => {
    render(<AppFooter />);
    const copyright = screen.queryByText(/© Crown copyright/);
    expect(copyright).toBeVisible();
  });
});
