import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import VaccineCovid19 from "@src/app/vaccines/covid-19/page";
import { act } from "react";
import mockCovid19VaccineContent from "@project/wiremock/__files/covid-19-vaccine.json";

jest.mock("@src/utils/config");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("COVID-19 vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display COVID-19 content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineCovid19());
    });

    const covid19Heading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: `COVID-19 vaccine`,
    });
    expect(covid19Heading).toBeInTheDocument();

    const overview = await screen.findByTestId("overview-text");
    expect(overview).toHaveTextContent(
      mockCovid19VaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
