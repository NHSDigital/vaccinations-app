import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import mockMenACWYVaccineContent from "@project/wiremock/__files/menacwy-vaccine.json";
import VaccineMenACWY from "@src/app/vaccines/menacwy/page";

jest.mock("@src/utils/config");

describe("MenACWY vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display MenACWY content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineMenACWY());
    });

    const heading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: "MenACWY vaccine",
    });
    expect(heading).toBeInTheDocument();

    const overview: HTMLElement = await screen.findByTestId("overview-text");
    expect(overview).toHaveTextContent(
      mockMenACWYVaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
