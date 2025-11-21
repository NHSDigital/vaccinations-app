import NonUrgentCareCard from "@src/app/_components/nhs-frontend/NonUrgentCareCard";
import { render, screen } from "@testing-library/react";

describe("NonUrgentCareCard", () => {
  it("should render component", () => {
    render(<NonUrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const nonUrgentCareCard: HTMLElement = screen.getByTestId("non-urgent-care-card");

    expect(nonUrgentCareCard).toBeVisible();
  });

  it("should render heading", () => {
    render(<NonUrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const defaultLevel2Heading: HTMLElement = screen.getByRole("heading", {
      name: "Non-urgent advice: Contact GP:",
      level: 2,
    });

    expect(defaultLevel2Heading).toBeVisible();
  });

  it("should render heading at specified level", () => {
    render(
      <NonUrgentCareCard heading={"Contact GP lvl 4:"} headingLevel={"h4"} content={<p>this is their contact</p>} />,
    );

    const level4Heading: HTMLElement = screen.getByRole("heading", {
      name: "Non-urgent advice: Contact GP lvl 4:",
      level: 4,
    });

    expect(level4Heading).toBeVisible();
  });

  it("should render content inside of care card", () => {
    render(<NonUrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const content: HTMLElement = screen.getByText("this is their contact");

    expect(content).toBeVisible();
  });
});
