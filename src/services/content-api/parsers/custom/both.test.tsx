import { ContentParsingError } from "@src/services/content-api/parsers/custom/exceptions";
import { styleHowToGetSubsection as styleHowToGetSubsectionForRsv } from "@src/services/content-api/parsers/custom/rsv";
import { styleHowToGetSubsection as styleHowToGetSubsectionForRsvInPregnancy } from "@src/services/content-api/parsers/custom/rsv-pregnancy";
import { VaccinePageSubsection } from "@src/services/content-api/types";
import { render } from "@testing-library/react";
import React from "react";

const mockNBSBookingActionHTML = "NBS Booking Link Test";
jest.mock("@src/app/_components/nbs/PharmacyBookingInfo", () => ({
  PharmacyBookingInfo: () => <p data-testid="pharmacy-booking-info">test</p>,
}));
jest.mock("@src/app/_components/nbs/NBSBookingAction", () => ({
  NBSBookingAction: () => mockNBSBookingActionHTML,
}));
jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockNonSimpleSubsection: VaccinePageSubsection = {
  type: "tableElement",
  name: "",
  mainEntity: "",
};

const mockRsvInPregnancySubsection: VaccinePageSubsection = {
  type: "simpleElement",
  text: "<h3>If you're pregnant</h3><p>Paragraph 1</p><p>Paragraph 2</p>",
  headline: "",
  name: "",
};

const mockRsvForOlderAdultsSubsection: VaccinePageSubsection = {
  type: "simpleElement",
  text: "<h3>If you're aged 75 or over</h3><p>Paragraph 1</p><p>Paragraph 2</p><h3>If you live in a care home for older adults</h3><p>Paragraph 3</p><p>Paragraph 4</p>",
  headline: "",
  name: "",
};

describe("styleHowToGetSubsection for rsv in older adults", () => {
  it("returns empty fragment if type is not 'simpleElement'", () => {
    const { container } = render(<>{styleHowToGetSubsectionForRsv(mockNonSimpleSubsection, 0, false)}</>);
    expect(container.innerHTML).toBe("");
  });

  it("returns empty fragment if no h3 is found for rsv for older adults", () => {
    const { container } = render(<>{styleHowToGetSubsectionForRsv(mockRsvInPregnancySubsection, 0, false)}</>);
    expect(container.innerHTML).toBe("");
  });

  it("throws ContentParsingError if type is not 'simpleElement'", () => {
    expect(() => {
      render(<>{styleHowToGetSubsectionForRsv(mockNonSimpleSubsection, 0, true)}</>);
    }).toThrow(ContentParsingError);
  });

  it("throws ContentParsingError if no h3 is found for rsv for older adults", () => {
    expect(() => {
      render(<>{styleHowToGetSubsectionForRsv(mockRsvInPregnancySubsection, 0, true)}</>);
    }).toThrow(ContentParsingError);
  });

  it("renders HTML if subsection contains rsv for older adults", () => {
    const { container } = render(<>{styleHowToGetSubsectionForRsv(mockRsvForOlderAdultsSubsection, 0, false)}</>);
    expect(container.innerHTML).toBe(
      '<div><div><h3>If you\'re aged 75 or over</h3><p>Paragraph 1</p><p>Paragraph 2</p></div><p data-testid="pharmacy-booking-info">test</p><div><h3>If you live in a care home for older adults</h3><p>Paragraph 3</p><p>Paragraph 4</p></div></div>',
    );
  });
});

describe("styleHowToGetSubsection for rsv in pregnancy", () => {
  it("returns empty fragment if type is not 'simpleElement'", () => {
    const { container } = render(<>{styleHowToGetSubsectionForRsvInPregnancy(mockNonSimpleSubsection, 0, false)}</>);
    expect(container.innerHTML).toBe("");
  });

  it("returns empty fragment if no h3 is found for rsv in pregnancy", () => {
    const { container } = render(
      <>{styleHowToGetSubsectionForRsvInPregnancy(mockRsvForOlderAdultsSubsection, 0, false)}</>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("throws ContentParsingError if type is not 'simpleElement'", () => {
    expect(() => {
      render(<>{styleHowToGetSubsectionForRsvInPregnancy(mockNonSimpleSubsection, 0, true)}</>);
    }).toThrow(ContentParsingError);
  });

  it("throws ContentParsingError if no h3 is found for rsv in pregnancy", () => {
    expect(() => {
      render(<>{styleHowToGetSubsectionForRsvInPregnancy(mockRsvForOlderAdultsSubsection, 0, true)}</>);
    }).toThrow(ContentParsingError);
  });

  it("renders HTML if subsection contains rsv in pregnancy", () => {
    const { container } = render(
      <>{styleHowToGetSubsectionForRsvInPregnancy(mockRsvInPregnancySubsection, 0, true)}</>,
    );
    expect(container.innerHTML).toBe(`<div><div><p>Paragraph 1</p><p>Paragraph 2</p></div></div>`);
  });
});
