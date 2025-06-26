import { render, screen } from "@testing-library/react";
import {
  H2,
  MarkdownWithStyling,
  allowHTMLElement,
} from "@src/app/_components/markdown/MarkdownWithStyling";
import React from "react";
import { Element as HastElement } from "hast";

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

      expect(mockedMarkdown).toHaveBeenCalledWith(
        expect.objectContaining({ children: content }),
        undefined,
      );
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

  describe("allowHTMLElement", () => {
    const expectedAllowedTags: string[] = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "b",
      "strong",
      "em",
      "i",
      "a",
      "ul",
      "ol",
      "li",
    ];

    it.each(expectedAllowedTags)(
      "should return true for the allowed HTML tag: <%s>",
      (tagName: string) => {
        const mockElement: HastElement = {
          type: "element",
          tagName: tagName,
          properties: {},
          children: [],
        };

        expect(allowHTMLElement(mockElement)).toBe(true);
      },
    );

    it("should return false for disallowed tag", () => {
      const mockElement: HastElement = {
        type: "element",
        tagName: "table",
        properties: {},
        children: [],
      };

      expect(allowHTMLElement(mockElement)).toBe(false);
    });
  });
});
