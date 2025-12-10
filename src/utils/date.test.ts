import { UtcDateFromStringSchema, UtcDateTimeFromStringSchema } from "@src/utils/date";

describe("utils-date", () => {
  describe("UtcDateFromStringSchema", () => {
    it.each([
      { description: "winter date", input: "2026-01-01" },
      { description: "summer date", input: "2026-06-01" },
    ])("should parse $description", ({ input }) => {
      const actual = UtcDateFromStringSchema.parse(input);
      expect(actual).toEqual(new Date(input));
    });

    it.each([
      { description: "invalid date", input: "2026-13-01" },
      { description: "date without dashes", input: "20261301" },
      { description: "badly formed date", input: "Sausages" },
    ])("should throw on $description", ({ input }) => {
      expect(() => {
        UtcDateFromStringSchema.parse(input);
      }).toThrow();
    });
  });

  describe("UtcDateTimeFromStringSchema", () => {
    it.each([
      {
        description: "winter date (Zulu)",
        input: "2026-01-01T13:16:02Z",
        expected: "2026-01-01T13:16:02.000Z",
      },
      {
        description: "summer date (Zulu)",
        input: "2026-06-01T13:16:02Z",
        expected: "2026-06-01T13:16:02.000Z",
      },
      {
        description: "winter date (Offset)",
        input: "2026-01-01T13:16:02+02:00",
        expected: "2026-01-01T11:16:02.000Z",
      },
      {
        description: "summer date (Offset)",
        input: "2026-06-01T13:16:02+02:00",
        expected: "2026-06-01T11:16:02.000Z",
      },
    ])("should parse $description", ({ input, expected }) => {
      const actual = UtcDateTimeFromStringSchema.parse(input);
      expect(actual).toEqual(new Date(expected));
    });

    it.each([
      { description: "invalid date (Zulu)", input: "2026-13-01T13:16:02Z" },
      { description: "invalid time (Zulu)", input: "2026-12-01T25:16:02Z" },
      { description: "date without dashes (Zulu)", input: "20261301T13:16:02Z" },
      { description: "badly formed string (Zulu)", input: "SausagesT13:16:02Z" },
      { description: "invalid date (Offset)", input: "2026-13-01T13:16:02+02:00" },
      { description: "invalid time (Offset)", input: "2026-12-01T25:16:02+02:00" },
      { description: "date without dashes (Offset)", input: "20261301T13:16:02+02:00" },
      { description: "badly formed string (Offset)", input: "SausagesT13:16:02+02:00" },
    ])("should throw on $description", ({ input }) => {
      expect(() => {
        UtcDateTimeFromStringSchema.parse(input);
      }).toThrow();
    });
  });
});
