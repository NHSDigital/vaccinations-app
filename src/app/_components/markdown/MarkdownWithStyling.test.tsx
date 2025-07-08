import { A, H2, MarkdownWithStyling, OL, UL } from "@src/app/_components/markdown/MarkdownWithStyling";
import { render, screen } from "@testing-library/react";
import React from "react";

let mockedMarkdown: jest.Mock;

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: (...args: []) => mockedMarkdown(...args),
}));

describe("markdown", () => {
  describe("MarkdownWithStyling", () => {
    beforeEach(() => {
      mockedMarkdown = jest.fn(({ children }) => <div>{children}</div>);
    });
    it("should call markdown component with correct content", () => {
      const content = "This is content";
      render(<MarkdownWithStyling content={content} />);

      expect(mockedMarkdown).toHaveBeenCalledWith(expect.objectContaining({ children: content }), undefined);
    });
  });

  describe("Custom HTML components", () => {
    it("should display styled Heading Level 2 (h2)", () => {
      const children = "This is heading";

      render(H2({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-heading-s");
    });

    it("should display styled Anchor (a) with ability to open in new tabs", () => {
      const children = "This is heading";
      const href = "https://example.com/";

      render(A({ href, children }));

      const anchor: HTMLElement = screen.getByText(children);

      expect(anchor).toBeVisible();
      expect(anchor).toHaveClass("nhsuk-link");
      expect(anchor).toHaveAttribute("href", "https://example.com/");
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noopener");
    });

    it("should display styled Unordered List (ul)", () => {
      const children = "Example list item";

      render(UL({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-list nhsuk-list--bullet");
    });

    it("should display styled Ordered List (ol)", () => {
      const children = "Example list item";

      render(OL({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-list nhsuk-list--number");
    });
  });
});
