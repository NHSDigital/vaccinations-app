import { UtcDateFromStringSchema, UtcDateTimeFromStringSchema } from "@src/utils/date";

describe("utils-date", () => {
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

  describe("UtcDateTimeFromStringSchema with Zulu time", () => {
    it("should parse winter date", () => {
      const actual = UtcDateTimeFromStringSchema.parse("2026-01-01T13:16:02Z");

      expect(actual).toEqual(new Date("2026-01-01T13:16:02.000Z"));
    });

    it("should parse summer date", () => {
      const actual = UtcDateTimeFromStringSchema.parse("2026-06-01T13:16:02Z");

      expect(actual).toEqual(new Date("2026-06-01T13:16:02.000Z"));
    });

    it("should throw on invalid date", () => {
      const given = "2026-13-01T13:16:02Z";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });

    it("should throw on invalid time", () => {
      const given = "2026-12-01T25:16:02Z";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });

    it("should throw on date without dashes", () => {
      const given = "20261301T13:16:02Z";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });

    it("should throw on badly formed date", () => {
      const given = "SausagesT13:16:02Z";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });
  });

  describe("UtcDateTimeFromStringSchema with offset time", () => {
    it("should parse winter date", () => {
      const actual = UtcDateTimeFromStringSchema.parse("2026-01-01T13:16:02+02:00");

      expect(actual).toEqual(new Date("2026-01-01T11:16:02.000Z"));
    });

    it("should parse summer date", () => {
      const actual = UtcDateTimeFromStringSchema.parse("2026-06-01T13:16:02+02:00");

      expect(actual).toEqual(new Date("2026-06-01T11:16:02.000Z"));
    });

    it("should throw on invalid date", () => {
      const given = "2026-13-01T13:16:02+02:00";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });

    it("should throw on invalid time", () => {
      const given = "2026-12-01T25:16:02+02:00";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });

    it("should throw on date without dashes", () => {
      const given = "20261301T13:16:02+02:00";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });

    it("should throw on badly formed date", () => {
      const given = "SausagesT13:16:02+02:00";

      expect(() => {
        UtcDateTimeFromStringSchema.parse(given);
      }).toThrow();
    });
  });
});
