import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import VaccineRsv from "@src/app/vaccines/rsv/page";
import { getContentForVaccine } from "@src/services/content-api/contentService";
import { JSX } from "react";

jest.mock("@src/services/content-api/contentService");

describe("RSV Page", () => {
  const mockHeading: string = "mock heading";
  const mockSubheading: string = "mock subheading";

  beforeEach(() => {
    const mockContent = {
      about: { name: mockHeading },
      hasPart: [{ description: mockSubheading }],
    };
    (getContentForVaccine as jest.Mock).mockResolvedValue(mockContent);
  });

  it("renders the correct page heading", async () => {
    const RsvPage: JSX.Element = await VaccineRsv();
    render(RsvPage);

    const heading: HTMLElement = screen.getByRole("heading", {
      level: 1,
      name: "mock heading",
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the correct subheading", async () => {
    const RsvPage: JSX.Element = await VaccineRsv();
    render(RsvPage);

    const subheading: HTMLElement = screen.getByText(mockSubheading);

    expect(subheading).toBeInTheDocument();
  });

  it("renders the correct more information heading", async () => {
    const RsvPage: JSX.Element = await VaccineRsv();
    render(RsvPage);

    const moreInformation: HTMLElement = screen.getByText("More information");

    expect(moreInformation).toBeInTheDocument();
  });

  it("renders the correct link text to more information", async () => {
    const RsvPage: JSX.Element = await VaccineRsv();
    render(RsvPage);

    const moreInformationLink: HTMLElement = screen.getByText(
      "Find out more about RSV vaccination on the NHS.uk",
    );

    expect(moreInformationLink).toBeInTheDocument();
  });
});
