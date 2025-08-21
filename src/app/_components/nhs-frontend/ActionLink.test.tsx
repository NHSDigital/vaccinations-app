import { useBrowserContext } from "@src/app/_components/context/BrowserContext";
import ActionLink from "@src/app/_components/nhs-frontend/ActionLink";
import { render, screen } from "@testing-library/react";

jest.mock("@src/app/_components/context/BrowserContext", () => ({
  useBrowserContext: jest.fn(),
}));

describe("ActionLink Component", () => {
  beforeAll(() => {
    window.open = jest.fn() as never;
  });

  const renderAndClickActionLink = (url: string, displayText: string) => {
    render(<ActionLink url={url} displayText={displayText} />);

    const actionLink = screen.getByRole("link", { name: displayText });
    actionLink.click();
  };

  it("renders properly", () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: true,
    });

    render(<ActionLink url={"https://example.com/sausages/"} displayText={"Sausages"} />);

    expect(screen.getByRole("link", { name: "Sausages" })).toHaveAttribute("href", "https://example.com/sausages/");
  });

  it("should open link in same window when action is clicked within NHS app", async () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: true,
    });

    renderAndClickActionLink("https://example.com/sausages/", "Sausages");

    expect(window.open).toHaveBeenCalledWith("https://example.com/sausages/", "_self");
  });

  it("should open link in new window when action is clicked within NHS app", async () => {
    (useBrowserContext as jest.Mock).mockReturnValue({
      hasContextLoaded: true,
      isOpenInMobileApp: false,
    });

    renderAndClickActionLink("https://example.com/sausages/", "Sausages");

    expect(window.open).toHaveBeenCalledWith("https://example.com/sausages/", "_blank");
  });
});
