import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import mockPneumococcalVaccineContent from "@project/wiremock/__files/pneumococcal-vaccine.json";
import VaccinePneumococcal from "@src/app/vaccines/pneumococcal/page";

jest.mock("@src/utils/config");

describe("Pneumococcal vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display Pneumococcal content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccinePneumococcal());
    });

    const heading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: "Pneumococcal vaccine",
    });
    expect(heading).toBeInTheDocument();

    const overview: HTMLElement = await screen.findByTestId("overview-text");
    expect(overview).toHaveTextContent(
      mockPneumococcalVaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
