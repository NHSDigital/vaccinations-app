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
      pendingUrl: null,
    });

    render(<TransitionLink href="/test-route">Go to test</TransitionLink>);

    fireEvent.click(screen.getByText("Go to test"));

    expect(mockNavigate).toHaveBeenCalledWith("/test-route");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("disables link when navigation is already pending for this url", () => {
    const url = "/test-route";

    (useNavigationTransition as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      isPending: true,
      pendingUrl: url,
    });

    render(<TransitionLink href={url}>Go to test</TransitionLink>);

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("does not disable link when pending navigation is for a different URL", () => {
    (useNavigationTransition as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      isPending: true,
      pendingUrl: "/navigation-in-progress-to-a-different-url",
    });

    render(<TransitionLink href="/test-route">Go to test</TransitionLink>);

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("aria-disabled", "false");
  });

  it("passes className through to the link", () => {
    (useNavigationTransition as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
      isPending: false,
    });

    render(
      <TransitionLink href="/test-route" className="test-class">
        Go to test
      </TransitionLink>,
    );

    const link = screen.getByRole("link");

    expect(link).toHaveClass("test-class");
  });
});
