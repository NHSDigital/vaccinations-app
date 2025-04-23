import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import VaccineFlu from "@src/app/vaccines/flu/page";
import Vaccine from "@src/app/_components/vaccine/Vaccine";

jest.mock("@src/utils/config");
jest.mock("@src/app/_components/vaccine/Vaccine", () => jest.fn(() => <div />));

describe("Flu vaccine page", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should contain back link to vaccination schedule page", () => {
    const pathToSchedulePage = "/schedule";

    render(VaccineFlu());

    const linkToSchedulePage = screen.getByRole("link", { name: "Go back" });

    expect(linkToSchedulePage.getAttribute("href")).toBe(pathToSchedulePage);
  });

  it("should contain vaccine component", () => {
    render(VaccineFlu());

    expect(Vaccine).toHaveBeenCalledWith(
      {
        name: "Flu",
      },
      undefined,
    );
  });
});
