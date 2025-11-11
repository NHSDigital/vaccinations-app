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

    const heading: HTMLElement = screen.getByRole("heading", { name: "Non-urgent advice: Contact GP:", level: 2 });

    expect(heading).toBeVisible();
  });

  it("should render content inside of care card", () => {
    render(<NonUrgentCareCard heading={"Contact GP:"} content={<p>this is their contact</p>} />);

    const content: HTMLElement = screen.getByText("this is their contact");

    expect(content).toBeVisible();
  });
});
