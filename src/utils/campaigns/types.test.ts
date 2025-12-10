import { VaccineType } from "@src/models/vaccine";
import { Campaigns } from "@src/utils/campaigns/types";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("Campaigns", () => {
  it("should convert json to a Campaigns ", async () => {
    const jsonString = JSON.stringify({
      COVID_19: [
        { start: "2025-11-12", end: "2026-03-01" },
        { start: "2026-09-01", end: "2027-03-01" },
      ],
      FLU_FOR_ADULTS: [
        { start: "2025-11-12", end: "2026-03-01" },
        { start: "2026-09-01", end: "2027-03-01" },
      ],
    });

    const actual = Campaigns.fromJson(jsonString);

    expect(actual!.get(VaccineType.COVID_19)).toStrictEqual([
      { start: new Date("2025-11-12"), end: new Date("2026-03-01") },
      { start: new Date("2026-09-01"), end: new Date("2027-03-01") },
    ]);

    expect(actual!.get(VaccineType.FLU_FOR_ADULTS)).toStrictEqual([
      { start: new Date("2025-11-12"), end: new Date("2026-03-01") },
      { start: new Date("2026-09-01"), end: new Date("2027-03-01") },
    ]);
  });

  describe("isActive", () => {
    const jsonString = JSON.stringify({ COVID_19: [{ start: "2025-11-12", end: "2026-03-01" }] });
    const campaigns = Campaigns.fromJson(jsonString)!;

    it.each([
      ["is inactive before start date", "2025-11-11", false],
      ["is active on start date", "2025-11-12", true],
      ["is active during campaign", "2025-12-25", true],
      ["is active on end date", "2026-03-01", true],
      ["is inactive after end date", "2026-03-02", false],
      ["is inactive in different year", "2024-01-01", false],
    ])("%s (%s) -> %s", (_, dateStr, expected) => {
      const dateToCheck = new Date(dateStr);
      const actual = campaigns.isActive(VaccineType.COVID_19, dateToCheck);

      expect(actual).toBe(expected);
    });
  });
});
