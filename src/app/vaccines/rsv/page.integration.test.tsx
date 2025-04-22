import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import { act } from "react";
import mockRsvVaccineContent from "@project/wiremock/__files/rsv-vaccine.json";

jest.mock("@src/utils/config");

describe("RSV vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display RSV content from embedded vaccine component", async () => {
    await act(async () => {
      render(VaccineRsv());
    });

    const rsvHeading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: `RSV vaccine`,
    });
    expect(rsvHeading).toBeInTheDocument();

    const overview = await screen.findByTestId("overview-text");
    expect(overview).toHaveTextContent(
      mockRsvVaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
