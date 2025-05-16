import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import mockShinglesVaccineContent from "@project/wiremock/__files/shingles-vaccine.json";
import VaccineShingles from "@src/app/vaccines/shingles/page";

jest.mock("@src/utils/config");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Pneumococcal vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display Pneumococcal content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineShingles());
    });

    const heading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: "Shingles vaccine",
    });
    expect(heading).toBeInTheDocument();

    const overview: HTMLElement = await screen.findByTestId("overview-text");
    expect(overview).toHaveTextContent(
      mockShinglesVaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
