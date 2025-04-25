import SSOFailure from "@src/app/sso/failure/page";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

describe("SSO Page", () => {
  it("shows message from query params", async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("Test error message"),
    });
    render(SSOFailure());

    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });
});
