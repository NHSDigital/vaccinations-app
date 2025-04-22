import { configProvider } from "@src/utils/config";
import { render, screen } from "@testing-library/react";
import Vaccine6in1 from "@src/app/vaccines/6-in-1/page";
import { act } from "react";
import mockSixInOneVaccineContent from "@project/wiremock/__files/6-in-1-vaccine.json";

jest.mock("@src/utils/config");

describe("6-in-1 vaccine page - integration test", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
    PINO_LOG_LEVEL: "info",
  }));

  it("should display 6-in-1 content from embedded vaccine component", async () => {
    await act(async () => {
      render(Vaccine6in1());
    });

    const sixInOneHeading: HTMLElement = await screen.findByRole("heading", {
      level: 1,
      name: `6-in-1 vaccine`,
    });
    expect(sixInOneHeading).toBeInTheDocument();

    const overview = await screen.findByTestId("overview-text");
    
    expect(overview).toHaveTextContent(
      mockSixInOneVaccineContent.mainEntityOfPage[0].text as string,
    );
  });
});
