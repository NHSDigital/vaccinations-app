import { DeployEnvironment } from "@src/types/environments";
import { UtcDateFromStringSchema, UtcDateTimeFromStringSchema, calculateAge, getNow } from "@src/utils/date";
import { headers } from "next/headers";

jest.mock("next/headers");

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

  describe("calculateAge", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(() => {
      jest.setSystemTime(new Date("2025-01-15T00:00:00.000Z").getTime());
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return age based on birthdate", () => {
      const birthdate = "2011-11-01";

      const result = calculateAge(birthdate);

      expect(result).toEqual(13);
    });

    it("should return age of previous year if tomorrow is their birthday", () => {
      const birthdate = "1987-01-16";

      const result = calculateAge(birthdate);

      expect(result).toEqual(37);
    });

    it("should return updated age if today is their birthday", () => {
      const birthdate = "1987-01-15";

      const result = calculateAge(birthdate);

      expect(result).toEqual(38);
    });

    it("should return age of this year if birthday was yesterday", () => {
      const birthdate = "1987-01-14";

      const result = calculateAge(birthdate);

      expect(result).toEqual(38);
    });

    it("should throw if birthdate is invalid", () => {
      const birthdate = "1987-13-17";

      expect(() => {
        calculateAge(birthdate);
      }).toThrow();
    });
  });

  describe("getNow", () => {
    const ENVIRONMENT = process.env;
    const fakeDateInSystem = "2000-01-01T01:01:01Z";
    const fakeDateInHeader = "1212-12-12T12:12:12Z";

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...ENVIRONMENT };
    });

    afterAll(() => {
      process.env = ENVIRONMENT;
    });

    describe("getNow  in non-production environments", () => {
      beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(fakeDateInSystem));
      });

      it("should return current date by default", async () => {
        expect(await getNow(DeployEnvironment.test)).toEqual(new Date(fakeDateInSystem));
      });

      it("should return date set in the header, when it is valid", async () => {
        const mockHeaders = {
          get: jest.fn(() => {
            return fakeDateInHeader;
          }),
        };
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        expect(await getNow(DeployEnvironment.test)).toEqual(new Date(fakeDateInHeader));
      });

      it("should return current date when date set in the header is malformed", async () => {
        const fakeDateInHeaderInvalid = "invalid-date";
        const mockHeaders = {
          get: jest.fn(() => {
            return fakeDateInHeaderInvalid;
          }),
        };
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        expect(await getNow(DeployEnvironment.test)).toEqual(new Date(fakeDateInSystem));
      });
    });

    describe("getNow in production environment", () => {
      beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(fakeDateInSystem));
      });

      it("should return current date by default in production environment", async () => {
        expect(await getNow(DeployEnvironment.prod)).toEqual(new Date(fakeDateInSystem));
      });

      it("should not check headers when environment is production", async () => {
        const mockHeaders = {
          get: jest.fn(() => {
            return fakeDateInHeader;
          }),
        };
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        expect(await getNow(DeployEnvironment.prod)).toEqual(new Date(fakeDateInSystem));
        expect(headers).not.toHaveBeenCalled();
      });
    });
  });
});
