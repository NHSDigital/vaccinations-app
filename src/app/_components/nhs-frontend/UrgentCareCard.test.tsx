import UrgentCareCard from "@src/app/_components/nhs-frontend/UrgentCareCard";
import { render, screen } from "@testing-library/react";

describe("UrgentCareCard", () => {
  it("should render component", () => {
    render(<UrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const urgentCareCard: HTMLElement = screen.getByTestId("urgent-care-card");

    expect(urgentCareCard).toBeVisible();
  });

  it("should render heading", () => {
    render(<UrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const defaultLevel2Heading: HTMLElement = screen.getByRole("heading", {
      name: "Urgent advice: Contact GP:",
      level: 2,
    });

    expect(defaultLevel2Heading).toBeVisible();
  });

  it("should render heading at specified heading level", () => {
    render(<UrgentCareCard heading={"Contact GP lvl 3:"} headingLevel={"h3"} content={<p>this is their contact</p>} />);

    const level3Heading: HTMLElement = screen.getByRole("heading", {
      name: "Urgent advice: Contact GP lvl 3:",
      level: 3,
    });

    expect(level3Heading).toBeVisible();
  });

  it("should render heading at level 2 by default if no heading level provided", () => {
    render(<UrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const heading: HTMLElement = screen.getByRole("heading", { name: "Urgent advice: Contact GP:", level: 2 });

    expect(heading).toBeVisible();
  });

  it("should render content inside of care card", () => {
    render(<UrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const content: HTMLElement = screen.getByText("this is their contact");

    expect(content).toBeVisible();
  });
});
