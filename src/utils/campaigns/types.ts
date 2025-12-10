import { VaccineType } from "@src/models/vaccine";
import { UtcDateFromStringSchema } from "@src/utils/date";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";
import { z } from "zod";

const log: Logger = logger.child({ module: "campaigns" });

const CampaignSchema = z
  .object({
    start: UtcDateFromStringSchema,
    end: UtcDateFromStringSchema,
  })
  .refine((data) => data.end >= data.start, {
    message: "End date must be after start date",
    path: ["end"],
  });

export type Campaign = z.infer<typeof CampaignSchema>;

export class Campaigns {
  private schedule: Partial<Record<VaccineType, Campaign[]>>;

  constructor(schedule: Partial<Record<VaccineType, Campaign[]>>) {
    this.schedule = schedule;
  }

  /**
   * Static Deserializer
   * Parses JSON string -> Validates with Zod -> Returns Class Instance
   */
  static fromJson(jsonString: string): Campaigns | undefined {
    try {
      const GenericSchema = z.record(z.string(), z.array(CampaignSchema));

      const rawObj = JSON.parse(jsonString);
      const parsedGeneric = GenericSchema.parse(rawObj);

      const validSchedule: Partial<Record<VaccineType, Campaign[]>> = {};

      const validVaccines = new Set(Object.values(VaccineType) as string[]);

      for (const [key, campaigns] of Object.entries(parsedGeneric)) {
        if (validVaccines.has(key)) {
          validSchedule[key as VaccineType] = campaigns;
        } else {
          log.warn({ context: { key } }, "Ignored unknown vaccine key");
        }
      }

      return new Campaigns(validSchedule);
    } catch (error) {
      log.warn({ context: { jsonString }, error }, "Failed to parse campaigns");
      return undefined;
    }
  }

  /** Get all campaigns for a specific vaccine */
  get(vaccine: VaccineType): Campaign[] {
    return this.schedule[vaccine] ?? [];
  }

  /** Check if a vaccine is currently active */
  isActive(vaccine: VaccineType, date: Date = new Date()): boolean {
    const campaigns = this.get(vaccine);
    return campaigns.some((c) => date >= c.start && date <= c.end);
  }

  /** Get a list of all vaccine names in the schedule */
  listVaccines(): VaccineType[] {
    return Object.keys(this.schedule) as VaccineType[];
  }
}
