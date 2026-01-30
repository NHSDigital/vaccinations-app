import { NavigationProvider, useNavigationTransition } from "@src/app/_components/context/NavigationContext";
import { fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

const TestLink = () => {
  const { navigate } = useNavigationTransition();

  return (
    <Link
      href="/test-route"
      onClick={(e) => {
        e.preventDefault();
        navigate("/test-route");
      }}
    >
      Go to test route
    </Link>
  );
};

describe("NavigationProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("navigates using router.push when link is clicked", () => {
    render(
      <NavigationProvider>
        <TestLink />
      </NavigationProvider>,
    );

    fireEvent.click(screen.getByText("Go to test route"));

    expect(mockPush).toHaveBeenCalledWith("/test-route");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("does not navigate when transition is pending", () => {
    jest.spyOn(React, "useTransition").mockReturnValue([true, jest.fn()]);

    render(
      <NavigationProvider>
        <TestLink />
      </NavigationProvider>,
    );

    fireEvent.click(screen.getByText("Go to test route"));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("throws when hook is used outside NavigationProvider", () => {
    expect(() => render(<TestLink />)).toThrow("useNavigationTransition must be used inside NavigationProvider");
  });
});
