import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import VaccineFlu from "@src/app/vaccines/flu/page";
import { act } from "react";
import mockFluVaccineContent from "@project/wiremock/__files/flu-vaccine.json";

jest.mock("@src/utils/config");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Flu vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display Flu content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineFlu());
    });

    const fluHeading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: "Flu vaccine",
    });
    expect(fluHeading).toBeInTheDocument();

    const overview: HTMLElement = await screen.findByTestId("overview-text");
    expect(overview).toHaveTextContent(
      mockFluVaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
