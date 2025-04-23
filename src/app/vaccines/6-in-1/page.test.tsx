import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";

jest.mock("@src/utils/config");
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));

describe("6-in-1 vaccine page", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should contain back link to vaccination schedule page", () => {
    const pathToSchedulePage = "/schedule";

    render(Vaccine6in1());

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });
    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain vaccine component", () => {
    render(Vaccine6in1());

    expect(Vaccine).toHaveBeenCalledWith(
      {
        name: "6-in-1",
      },
      undefined,
    );
  });
});
