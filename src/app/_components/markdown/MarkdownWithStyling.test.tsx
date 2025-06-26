import { render, screen } from "@testing-library/react";
import {
  H2,
  MarkdownWithStyling,
} from "@src/app/_components/markdown/MarkdownWithStyling";
import React from "react";

jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

describe("markdown", () => {
  describe("MarkdownWithStyling", () => {
    it("should display markdown content", () => {
      const content = "This is content";
      render(MarkdownWithStyling({ content }));

      const displayedContent: HTMLElement = screen.getByText(content);

      expect(displayedContent).toBeVisible();
    });
  });

  describe("H2", () => {
    it("should display styled h2", () => {
      const children = "This is heading";
      render(H2({ children }));

      const heading: HTMLElement = screen.getByText(children);

      expect(heading).toBeVisible();
      expect(heading).toHaveClass("nhsuk-heading-s");
    });
  });
});
