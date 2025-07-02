import sanitiseHtml from "@src/utils/sanitise-html";

describe("sanitiseHtml", () => {
  it("should add noopener to links with target already set", () => {
    const htmlWithTargetBlankLink =
      '<div><p>Text for <a href="https://www.vita-test.uk/" target="_blank">Link 1</a> content.';
    const expectedHyperlink = '<a href="https://www.vita-test.uk/" target="_blank" rel="noopener">Link 1</a>';

    const sanitisedHtml = sanitiseHtml(htmlWithTargetBlankLink);

    expect(sanitisedHtml).toContain(expectedHyperlink);
  });

  it("should set all links that do not have target to open externally", () => {
    const htmlLinkWithoutTarget = '<div><p>Text for <a href="https://www.vita-test.uk/">Link 1</a> content.</p></div>';
    const expectedHtmlWithTarget = '<a href="https://www.vita-test.uk/" target="_blank" rel="noopener">Link 1</a>';

    const sanitisedHtml = sanitiseHtml(htmlLinkWithoutTarget);

    expect(sanitisedHtml).toContain(expectedHtmlWithTarget);
  });

  it("should not amend rel attribute on other non-link elements", () => {
    const htmlWithTargetAttributeOnNonAnchorElement = "<div><p>paragraph content.</p></div>";

    const sanitisedHtml = sanitiseHtml(htmlWithTargetAttributeOnNonAnchorElement);

    expect(sanitisedHtml).toEqual(htmlWithTargetAttributeOnNonAnchorElement);
  });
});
