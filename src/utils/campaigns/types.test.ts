import { VaccineType } from "@src/models/vaccine";
import { Campaigns } from "@src/utils/campaigns/types";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("Campaigns", () => {
  const jsonString = JSON.stringify({
    COVID_19: [
      { start: "2025-11-12T09:00:00Z", end: "2026-03-01T09:00:00+02:00" },
      { start: "2026-09-01T09:00:00+02:00", end: "2027-03-01T09:00:00Z" },
    ],
    FLU_FOR_ADULTS: [
      { start: "2025-11-12T09:00:00+02:00", end: "2026-03-01T09:00:00Z" },
      { start: "2026-09-01T09:00:00Z", end: "2027-03-01T09:00:00+02:00" },
    ],
  });

  it("should convert json to a Campaigns ", async () => {
    const actual = Campaigns.fromJson(jsonString);

    expect(actual!.get(VaccineType.COVID_19)).toStrictEqual([
      { start: new Date("2025-11-12T09:00:00Z"), end: new Date("2026-03-01T07:00:00Z") },
      { start: new Date("2026-09-01T07:00:00Z"), end: new Date("2027-03-01T09:00:00Z") },
    ]);

    expect(actual!.get(VaccineType.FLU_FOR_ADULTS)).toStrictEqual([
      { start: new Date("2025-11-12T07:00:00Z"), end: new Date("2026-03-01T09:00:00Z") },
      { start: new Date("2026-09-01T09:00:00Z"), end: new Date("2027-03-01T07:00:00Z") },
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
});
