import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("BackLink component", () => {
  it("renders the back link with text", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
    });

    render(<BackLink />);
    const backText = screen.getByText("Back");
    expect(backText).toBeInstanceOf(HTMLAnchorElement);
  });

  it("calls router.back() when clicked", () => {
    const backMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      back: backMock,
    });

    render(<BackLink />);
    const link = screen.getByRole("link", { name: /back/i });
    fireEvent.click(link);

    expect(backMock).toHaveBeenCalledTimes(1);
  });
});
