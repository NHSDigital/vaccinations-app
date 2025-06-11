import { styleHowToGetSubsection } from "@src/services/content-api/parsers/custom/rsv";
import { VaccinePageSubsection } from "@src/services/content-api/types";
import React from "react";
import { render } from "@testing-library/react";

describe("styleHowToGetSubsection", () => {
  it("returns empty fragment if type is not 'simpleElement'", () => {
    const subsection: VaccinePageSubsection = {
      type: "tableElement",
      name: "",
      mainEntity: "",
    };
    const { container } = render(<>{styleHowToGetSubsection(subsection, 0)}</>);
    expect(container.innerHTML).toBe("");
  });

  it("returns empty fragment if no h3 is found for rsv for older adults", () => {
    const subsection: VaccinePageSubsection = {
      type: "simpleElement",
      text: "<h3>If you're pregnant</h3><p>Paragraph 1</p><p>Paragraph 2</p>",
      headline: "",
      name: "",
    };
    const { container } = render(<>{styleHowToGetSubsection(subsection, 0)}</>);
    expect(container.innerHTML).toBe("");
  });

  it("renders HTML if both regexes match", () => {
    const subsection: VaccinePageSubsection = {
      type: "simpleElement",
      text: "<h3>If you're aged 75 to 79</h3><p>Paragraph 1</p><p>Paragraph 2</p>",
      headline: "",
      name: "",
    };

    const { container } = render(<>{styleHowToGetSubsection(subsection, 0)}</>);
    expect(container.innerHTML).toBe(
      "<div><p>Paragraph 1</p><p>Paragraph 2</p></div>",
    );
  });
});
