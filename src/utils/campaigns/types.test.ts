import { VaccineType } from "@src/models/vaccine";
import { Campaigns } from "@src/utils/campaigns/types";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("Campaigns", () => {
  const jsonString = JSON.stringify({
    COVID_19: [
      { preStart: "2025-11-03T09:00:00Z", start: "2025-11-12T09:00:00Z", end: "2026-03-01T09:00:00+02:00" },
      { preStart: "2026-08-15T09:00:00Z", start: "2026-09-01T09:00:00+02:00", end: "2027-03-01T09:00:00Z" },
    ],
    FLU_FOR_ADULTS: [
      { preStart: "2025-11-12T09:00:00+02:00", start: "2025-11-12T09:00:00+02:00", end: "2026-03-01T09:00:00Z" },
      { preStart: "2026-09-01T09:00:00Z", start: "2026-09-01T09:00:00Z", end: "2027-03-01T09:00:00+02:00" },
    ],
  });

  it("should convert json to a Campaigns ", async () => {
    const actual = Campaigns.fromJson(jsonString);

    expect(actual!.get(VaccineType.COVID_19)).toStrictEqual([
      {
        preStart: new Date("2025-11-03T09:00:00Z"),
        start: new Date("2025-11-12T09:00:00Z"),
        end: new Date("2026-03-01T07:00:00Z"),
      },
      {
        preStart: new Date("2026-08-15T09:00:00Z"),
        start: new Date("2026-09-01T07:00:00Z"),
        end: new Date("2027-03-01T09:00:00Z"),
      },
    ]);

    expect(actual!.get(VaccineType.FLU_FOR_ADULTS)).toStrictEqual([
      {
        preStart: new Date("2025-11-12T09:00:00+02:00"),
        start: new Date("2025-11-12T07:00:00Z"),
        end: new Date("2026-03-01T09:00:00Z"),
      },
      {
        preStart: new Date("2026-09-01T09:00:00Z"),
        start: new Date("2026-09-01T09:00:00Z"),
        end: new Date("2027-03-01T07:00:00Z"),
      },
    ]);
  });

  describe("isActive", () => {
    const campaigns = Campaigns.fromJson(jsonString)!;

    it.each([
      ["inactive: before first start", "2025-11-12T08:59:59Z", false],
      ["active: exact first start", "2025-11-12T09:00:00Z", true],
      ["active: during first range", "2025-12-25T12:00:00Z", true],
      ["active: exact first end", "2026-03-01T07:00:00Z", true],
      ["inactive: 1 sec after first end", "2026-03-01T07:00:01Z", false],
      ["inactive: in the gap (May)", "2026-05-01T09:00:00Z", false],
      ["inactive: just before 2nd start", "2026-09-01T06:59:59Z", false],
      ["active: exact second start", "2026-09-01T07:00:00Z", true],
      ["active: during second range", "2026-12-25T12:00:00Z", true],
      ["active: exact second end", "2027-03-01T09:00:00Z", true],
      ["inactive: after second end", "2027-03-01T09:00:01Z", false],
      ["inactive: way before", "2020-01-01T00:00:00Z", false],
      ["inactive: way after", "2030-01-01T00:00:00Z", false],
    ])("%s (%s) -> %s", (_, dateStr, expected) => {
      const dateToCheck = new Date(dateStr);
      const actual = campaigns.isActive(VaccineType.COVID_19, dateToCheck);

      expect(actual).toBe(expected);
    });

    it("should return false for vaccine with no campaign", () => {
      const campaigns = Campaigns.fromJson(jsonString)!;

      const active = campaigns.isActive(VaccineType.FLU_FOR_CHILDREN);

      expect(active).toBe(false);
    });
  });

  describe("isPreOpen", () => {
    const campaigns = Campaigns.fromJson(jsonString)!;

    it.each([
      ["closed campaign 1: before pre-start", "2025-11-03T08:59:59Z", false],
      ["pre-start campaign 1: exact pre-start", "2025-11-03T09:00:00Z", true],
      ["pre-start campaign 1: during pre-start range", "2025-11-04T12:00:00Z", true],
      ["open campaign 1: exact start", "2025-11-12T09:00:00Z", false],
      ["closed campaign 1: in the gap (May)", "2026-05-01T09:00:00Z", false],
      ["pre-start campaign 2: exact pre-start", "2026-08-15T09:00:00Z", true],
      ["pre-start campaign 2: during pre-start range", "2026-08-17T09:00:00Z", true],
      ["pre-start campaign 2: 1 sec before start", "2026-09-01T06:59:59Z", true],
      ["closed campaign 2: after end", "2027-03-01T09:00:01Z", false],
      ["closed campaign: way before", "2020-01-01T00:00:00Z", false],
      ["closed campaign: way after", "2030-01-01T00:00:00Z", false],
    ])("%s (%s) -> %s", (_, dateStr, expected) => {
      const dateToCheck = new Date(dateStr);
      const actual = campaigns.isPreOpen(VaccineType.COVID_19, dateToCheck);

      expect(actual).toBe(expected);
    });

    it.each([
      ["closed campaign 1: before pre-start", "2025-11-11T09:00:00+02:00", false],
      ["pre-start campaign 1: exact pre-start", "2025-11-12T09:00:00+02:00", false],
      ["open campaign 1: exact start", "2025-11-12T09:00:00+02:00", false],
      ["closed campaign: way before", "2015-11-12T09:00:00+02:00", false],
      ["closed campaign: way after", "2035-11-12T09:00:00+02:00", false],
    ])("%s (%s) -> %s", (_, dateStr, expected) => {
      const dateToCheck = new Date(dateStr);
      const actual = campaigns.isPreOpen(VaccineType.FLU_FOR_ADULTS, dateToCheck);

      expect(actual).toBe(expected);
    });

    it("should return false for vaccine with no campaign", () => {
      const campaigns = Campaigns.fromJson(jsonString)!;

      const preOpen = campaigns.isPreOpen(VaccineType.FLU_FOR_CHILDREN);

      expect(preOpen).toBe(false);
    });
  });

  describe("validating campaigns do not overlap", () => {
    it("should throw when campaigns are overlapping", () => {
      const jsonString = JSON.stringify({
        COVID_19: [
          { preStart: "2025-10-03T09:00:00Z", start: "2025-11-03T09:00:00Z", end: "2026-01-03T17:00:00Z" },
          { preStart: "2026-02-03T09:00:00Z", start: "2026-03-03T09:00:00Z", end: "2026-06-03T17:00:00Z" },
          { preStart: "2026-03-03T09:00:00Z", start: "2026-07-03T09:00:00Z", end: "2026-10-03T17:00:00Z" },
          { preStart: "2026-04-03T09:00:00Z", start: "2026-05-03T09:00:00Z", end: "2026-06-03T17:00:00Z" },
        ],
      });

      const campaigns = Campaigns.fromJson(jsonString)!;
      expect(campaigns).not.toBeDefined();
    });

    it("should not throw when campaigns are overlapping", () => {
      const jsonString = JSON.stringify({
        COVID_19: [
          { preStart: "2025-10-03T09:00:00Z", start: "2025-11-03T09:00:00Z", end: "2026-01-03T17:00:00Z" },
          { preStart: "2026-02-03T09:00:00Z", start: "2026-03-03T09:00:00Z", end: "2026-04-03T17:00:00Z" },
          { preStart: "2026-05-03T09:00:00Z", start: "2026-07-03T09:00:00Z", end: "2026-08-03T17:00:00Z" },
          { preStart: "2026-09-03T09:00:00Z", start: "2026-10-03T09:00:00Z", end: "2026-12-03T17:00:00Z" },
        ],
      });

      const campaigns = Campaigns.fromJson(jsonString)!;
      expect(campaigns).toBeDefined();
    });
  });
});
