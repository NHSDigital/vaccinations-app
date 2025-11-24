import AppFooter from "@src/app/_components/nhs-frontend/AppFooter";
import { render, screen } from "@testing-library/react";

describe("AppFooter", () => {
  beforeEach(() => {
    render(<AppFooter />);
  });

  it("renders crown copyright", async () => {
    const copyright: HTMLElement = screen.getByText(/© NHS England/);
    expect(copyright).toBeVisible();
  });

  it("renders privacy policy", async () => {
    const privacyPolicy: HTMLElement = screen.getByText(/Privacy policy/);
    expect(privacyPolicy).toBeVisible();
  });

  it("renders help and support", async () => {
    const helpAndSupport: HTMLElement = screen.getByText(/Help and support/);
    expect(helpAndSupport).toBeVisible();
  });

  it("renders accessibility statement", async () => {
    const accessibilityStatement: HTMLElement = screen.getByText(/Accessibility statement/);
    expect(accessibilityStatement).toBeVisible();
  });

  it("renders cookies policy", async () => {
    const cookiesPolicy: HTMLElement = screen.getByText(/Cookies/);
    expect(cookiesPolicy).toBeVisible();
  });
});
