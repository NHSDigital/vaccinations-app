import AppFooter from "@src/app/_components/nhs-frontend/AppFooter";
import { render, screen } from "@testing-library/react";

describe("AppFooter", () => {
  beforeEach(() => {
    render(<AppFooter />);
  });

  it("renders crown copyright", async () => {
    const copyright = screen.queryByText(/© Crown copyright/);
    expect(copyright).toBeVisible();
  });

  it("renders privacy policy", async () => {
    const privacyPolicy = screen.queryByText(/Privacy policy/);
    expect(privacyPolicy).toBeVisible();
  });

  it("renders help and support", async () => {
    const helpAndSupport = screen.queryByText(/Help and support/);
    expect(helpAndSupport).toBeVisible();
  });

  it("renders accessibility statement", async () => {
    const accessibilityStatement = screen.queryByText(/Accessibility statement/);
    expect(accessibilityStatement).toBeVisible();
  });

  it("renders cookies policy", async () => {
    const cookiesPolicy = screen.queryByText(/Cookies/);
    expect(cookiesPolicy).toBeVisible();
  });
});
