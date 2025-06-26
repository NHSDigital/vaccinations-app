import { render, screen } from "@testing-library/react";
import {
  H2,
  MarkdownWithStyling,
} from "@src/app/_components/markdown/MarkdownWithStyling";
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

      expect(mockedMarkdown).toHaveBeenCalledWith(
        expect.objectContaining({ children: content }),
        undefined,
      );
    });

    // it("should call markdown component with correct content 2", () => {
    //   mockedMarkdown = jest.fn(() => undefined);
    //   const content = "This is content";
    //   render(<MarkdownWithStyling content={content} />);
    //
    //   expect(mockedMarkdown).toHaveBeenCalledWith(
    //     expect.objectContaining({ children: undefined }),
    //     undefined
    //   );
    // });
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
