import { UtcDateFromStringSchema } from "@src/utils/date";

describe("UtcDateFromStringSchema", () => {
  it("should parse winter date", () => {
    const actual = UtcDateFromStringSchema.parse("2026-01-01");

    expect(actual).toEqual(new Date("2026-01-01"));
  });

  it("should parse summer date", () => {
    const actual = UtcDateFromStringSchema.parse("2026-06-01");

    expect(actual).toEqual(new Date("2026-06-01"));
  });

  it("should throw on invalid date", () => {
    const given = "2026-13-01";

    expect(() => {
      UtcDateFromStringSchema.parse(given);
    }).toThrow();
  });

  it("should throw on date without dashes", () => {
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
