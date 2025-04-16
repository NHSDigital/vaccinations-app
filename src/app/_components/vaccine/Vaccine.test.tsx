import { VaccineContentProvider } from "@src/app/_components/providers/VaccineContentProvider";
import Vaccine from "@src/app/_components/vaccine/Vaccine";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { StyledVaccineContent } from "@src/services/content-api/parsers/content-styling-service";
import { mockStyledContent } from "@test-data/content-api/data";
import { render, screen } from "@testing-library/react";
import { act } from "react";

jest.mock("@src/services/content-api/gateway/content-reader-service");

describe("Any vaccine page", () => {
  const mockVaccineName = "Test-Name";
  let contentPromise: Promise<StyledVaccineContent>;

  beforeEach(() => {
    (getContentForVaccine as jest.Mock).mockResolvedValue(
      mockStyledContent,
    );
    contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
  });

  const renderVaccinePage = async () => {
    await act(async () => {
      render(
        <VaccineContentProvider contentPromise={contentPromise}>
          <Vaccine name={mockVaccineName} vaccine={VaccineTypes.SIX_IN_ONE} />
        </VaccineContentProvider>,
      );
    });
  };

  it("should contain correct vaccine name in heading", async () => {
    await renderVaccinePage();

    const heading = screen.getByRole("heading", {
      level: 1,
      name: `${mockVaccineName} vaccine`,
    });

    expect(heading).toBeInTheDocument();
  });

  it("should contain overview text", async () => {
    await renderVaccinePage();
    const overviewBlock = screen.getByText("Overview text");
    expect(overviewBlock).toBeInTheDocument();
  });

  it("should contain whatItIsFor expander block", async () => {
    await renderVaccinePage();

    const heading = screen.getByText("what-heading");
    const content = screen.getByText("What Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain whoVaccineIsFor expander block", async () => {
    await renderVaccinePage();

    const heading = screen.getByText("who-heading");
    const content = screen.getByRole("heading", {
      level: 2,
      name: "Who Section styled component",
    });

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain howToGetVaccine expander block", async () => {
    await renderVaccinePage();

    const heading = screen.getByText("how-heading");
    const content = screen.getByText("How Section styled component");

    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("should contain webpage link", async () => {
    await renderVaccinePage();

    const webpageLink = screen.getByRole("link", {
      name: `Learn more about the ${mockVaccineName} vaccination on nhs.uk`,
    });

    expect(webpageLink).toBeInTheDocument();
    expect(webpageLink).toHaveAttribute("href", "https://www.test.com/");
  });
});
