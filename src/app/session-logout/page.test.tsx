import SessionLogout from "@src/app/session-logout/page";
import { render, screen } from "@testing-library/react";

describe("SessionLogout", () => {
  let mockIsOpenInNHSApp: () => boolean;
  let mockGoToHomePage: () => void;

  beforeEach(() => {
    mockIsOpenInNHSApp = jest.fn();
    mockGoToHomePage = jest.fn();

    Object.defineProperty(window, "nhsapp", {
      value: {
        tools: { isOpenInNHSApp: mockIsOpenInNHSApp },
        navigation: { goToHomePage: mockGoToHomePage },
      },
      writable: true,
    });
  });

  it("should show mobile version inside NHS App", () => {
    (mockIsOpenInNHSApp as jest.Mock).mockReturnValue(true);
    render(<SessionLogout />);
    const mobileButton = screen.getByRole("button", { name: "Log back in" });
    expect(mobileButton).toBeInTheDocument();
  });

  it("should show desktop version outside NHS App", () => {
    (mockIsOpenInNHSApp as jest.Mock).mockReturnValue(false);
    render(<SessionLogout />);
    const desktopButton = screen.getByRole("button", { name: "Continue" });
    expect(desktopButton).toBeInTheDocument();
  });
});
