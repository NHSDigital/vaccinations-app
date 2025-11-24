import { FeedbackBanner } from "@src/app/_components/feedback/FeedbackBanner";
import { render, screen } from "@testing-library/react";

describe("FeedbackBanner", () => {
  it("should render feedbackBanner with correct text and feedback link", () => {
    const testReferrer = "test";

    render(<FeedbackBanner referrer={testReferrer} />);

    const feedbackText: HTMLElement = screen.getByText(/This is a new NHS App service\. Help us improve it and/i);
    const feedbackLink: HTMLAnchorElement = screen.getByRole("link", { name: "give your feedback" });
    const feedbackUrl: URL = new URL(feedbackLink.href);

    expect(feedbackText).toBeVisible();
    expect(feedbackLink).toBeVisible();
    expect(feedbackUrl.searchParams.get("page")).toBe(testReferrer);
  });
});
