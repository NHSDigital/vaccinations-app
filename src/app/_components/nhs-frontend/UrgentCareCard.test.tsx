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

    const heading: HTMLElement = screen.getByRole("heading", { name: "Urgent advice: Contact GP:", level: 2 });

    expect(heading).toBeVisible();
  });

  it("should render content inside of care card", () => {
    render(<UrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const content: HTMLElement = screen.getByText("this is their contact");

    expect(content).toBeVisible();
  });
});
