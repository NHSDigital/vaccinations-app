import { useNavigationTransition } from "@src/app/_components/context/NavigationContext";
import { TransitionLink } from "@src/app/_components/navigation/TransitionLink";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@src/app/_components/context/NavigationContext", () => ({
  useNavigationTransition: jest.fn(),
}));

const mockNavigate = jest.fn();

describe("TransitionLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls navigate with href when clicked", () => {
    (useNavigationTransition as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      isPending: false,
    });

    render(<TransitionLink href="/test-route">Go to test</TransitionLink>);

    fireEvent.click(screen.getByText("Go to test"));

    expect(mockNavigate).toHaveBeenCalledWith("/test-route");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("sets aria-disabled when navigation is pending", () => {
    (useNavigationTransition as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      isPending: true,
    });

    render(<TransitionLink href="/test-route">Go to test</TransitionLink>);

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("passes className and target through to the link", () => {
    (useNavigationTransition as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      isPending: false,
    });

    render(
      <TransitionLink href="/test-route" className="test-class" target="_blank">
        Go to test
      </TransitionLink>,
    );

    const link = screen.getByRole("link");

    expect(link).toHaveClass("test-class");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
