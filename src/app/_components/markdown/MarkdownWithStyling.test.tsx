import { A, H1, H2, H3, H4, MarkdownWithStyling, OL, P, UL } from "@src/app/_components/markdown/MarkdownWithStyling";
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
      render(<MarkdownWithStyling content={content} classNames={{ h2: "sausages" }} />);

      expect(mockedMarkdown).toHaveBeenCalledWith(expect.objectContaining({ children: content }), undefined);
    });
  });

  describe("Custom HTML components", () => {
    it("should display styled Heading Level 1 (h1)", () => {
      const children = "This is heading";

      render(H1({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-heading-l");
    });

    it("should display styled Heading Level 1 (h1) with custom classes", () => {
      const children = "This is heading";

      render(H1({ children, className: "bananas chips" }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("bananas chips");
    });

    it("should display styled Heading Level 2 (h2)", () => {
      const children = "This is heading";

      render(H2({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-heading-m");
    });

    it("should display styled Heading Level 2 (h2) with custom classes", () => {
      const children = "This is heading";

      render(H2({ children, className: "bananas chips" }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("bananas chips");
    });

    it("should display styled Heading Level 3 (h3)", () => {
      const children = "This is heading";

      render(H3({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-heading-s");
    });

    it("should display styled Heading Level 3 (h3) with custom classes", () => {
      const children = "This is heading";

      render(H3({ children, className: "bananas chips" }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("bananas chips");
    });

    it("should display styled Heading Level 4 (h4)", () => {
      const children = "This is heading";

      render(H4({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-heading-xs");
    });

    it("should display styled Heading Level 4 (h4) with custom classes", () => {
      const children = "This is heading";

      render(H4({ children, className: "bananas chips" }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("bananas chips");
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

    it("should display styled Anchor (a) with custom classes", () => {
      const children = "This is heading";
      const href = "https://example.com/";

      render(A({ href, children, className: "bananas chips" }));

      const anchor: HTMLElement = screen.getByText(children);

      expect(anchor).toBeVisible();
      expect(anchor).toHaveClass("bananas chips");
    });

    it("should display styled Unordered List (ul)", () => {
      const children = "Example list item";

      render(UL({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-list nhsuk-list--bullet");
    });

    it("should display styled Unordered List (ul) with custom classes", () => {
      const children = "Example list item";

      render(UL({ children, className: "bananas chips" }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("bananas chips");
    });

    it("should display styled Ordered List (ol)", () => {
      const children = "Example list item";

      render(OL({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-list nhsuk-list--number");
    });

    it("should display styled Ordered List (ol) with custom classes", () => {
      const children = "Example list item";

      render(OL({ children, className: "bananas chips" }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("bananas chips");
    });

    it("should display styled Paragraph (p)", () => {
      const children = "Example paragraph";

      render(P({ children }));

      const para: HTMLElement = screen.getByText(children);

      expect(para).toBeVisible();
      expect(para).not.toHaveClass();
    });

    it("should display styled Paragraph (p) with custom classes", () => {
      const children = "Example paragraph";

      render(P({ children, className: "sausages" }));

      const para: HTMLElement = screen.getByText(children);

      expect(para).toBeVisible();
      expect(para).toHaveClass("sausages");
    });
  });
});
