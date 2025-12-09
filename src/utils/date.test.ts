import { UtcDateFromStringSchema } from "@src/utils/date";

describe("UtcDateFromStringSchema", () => {
  it("should parse winter date", () => {
    const actual = UtcDateFromStringSchema.parse("20260101");

    expect(actual).toEqual(new Date("2026-01-01"));
  });

  it("should parse summer date", () => {
    const actual = UtcDateFromStringSchema.parse("20260601");

    expect(actual).toEqual(new Date("2026-06-01"));
  });

  it("should throw on invalid date", () => {
    const given = "20261301";

    expect(() => {
      UtcDateFromStringSchema.parse(given);
    }).toThrow();
  });

  it("should throw on badly formed date", () => {
    const given = "Sausages";

    expect(() => {
      UtcDateFromStringSchema.parse(given);
    }).toThrow();
  });
});
