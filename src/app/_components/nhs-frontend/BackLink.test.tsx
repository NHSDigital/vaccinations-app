import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import { mockNHSAppJSFunctions } from "@src/utils/nhsapp-js.test";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("BackLink component", () => {
  const mockIsOpenInNHSApp = jest.fn();
  const mockSetBackAction = jest.fn();

  beforeAll(async () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: true,
    });
    mockNHSAppJSFunctions(mockIsOpenInNHSApp, jest.fn(), jest.fn(), jest.fn(), mockSetBackAction);
  });

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

  it("sets back action on mobile", async () => {
    mockIsOpenInNHSApp.mockReturnValue(true);

    render(<BackLink />);

    expect(mockSetBackAction).toHaveBeenCalledTimes(1);
  });
});
