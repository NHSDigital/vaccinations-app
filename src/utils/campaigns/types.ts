import { VaccineType } from "@src/models/vaccine";
import { UtcDateTimeFromStringSchema } from "@src/utils/date";
import { logger } from "@src/utils/logger";
import { Logger } from "pino";
import { z } from "zod";

const log: Logger = logger.child({ module: "campaigns" });

const CampaignSchema = z
  .object({
    preStart: UtcDateTimeFromStringSchema,
    start: UtcDateTimeFromStringSchema,
    end: UtcDateTimeFromStringSchema,
  })
  .refine((data) => data.end >= data.start, {
    message: "End date must be after start date",
    path: ["end"],
  })
  .refine((data) => data.end >= data.preStart, {
    message: "Pre start date must be before end date",
    path: ["preStart"],
  })
  .refine((data) => data.preStart <= data.start, {
    message: "Pre start date must be before or equal to start date",
    path: ["start"],
  });

const NoOverlapSchema = z.record(z.string(), campaignsArrayNoOverlap());

function campaignsArrayNoOverlap() {
  return z.array(CampaignSchema).superRefine((campaigns, validationErrors) => {
    if (campaigns.length <= 1) return;

    const sorted = [...campaigns].sort((a, b) => a.preStart.getTime() - b.preStart.getTime());

    for (let i = 1; i < sorted.length; i++) {
      const previous = sorted[i - 1];
      const current = sorted[i];

      const overlaps = current.preStart <= previous.end;

      if (overlaps) {
        const currentIndex = campaigns.indexOf(current);
        validationErrors.addIssue({
          code: "custom",
          message: `Overlapping campaigns: [${previous.preStart.toISOString()} – ${previous.end.toISOString()}] and [${current.preStart.toISOString()} – ${current.end.toISOString()}]`,
          path: [currentIndex >= 0 ? currentIndex : i, "start"],
        });
      }
    }
  });
}

export type Campaign = z.infer<typeof CampaignSchema>;

export class Campaigns {
  private readonly schedule: Partial<Record<VaccineType, Campaign[]>>;

  constructor(schedule: Partial<Record<VaccineType, Campaign[]>>) {
    this.schedule = schedule;
  }

  /**
   * Static Deserializer
   * Parses JSON string -> Validates with Zod -> Returns Class Instance
   */
  static fromJson(jsonString: string): Campaigns | undefined {
    try {
      const rawObj = JSON.parse(jsonString);
      const parsedSchema = NoOverlapSchema.parse(rawObj);

      const validSchedule: Partial<Record<VaccineType, Campaign[]>> = {};

      const validVaccines = new Set(Object.values(VaccineType) as string[]);

      for (const [key, campaigns] of Object.entries(parsedSchema)) {
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
    return this.schedule[vaccine] || [];
  }

  /** Check if a vaccine is currently in Open state (between start and end dates) */
  isOpen(vaccine: VaccineType, date: Date = new Date()): boolean {
    const campaigns = this.get(vaccine);
    return campaigns.some((c) => date >= c.start && date <= c.end);
  }

  /** Check if a vaccine is currently pre-open (between preStart and start dates) */
  isPreOpen(vaccine: VaccineType, date: Date = new Date()): boolean {
    const campaigns = this.get(vaccine);
    return campaigns.some((c) => date >= c.preStart && date < c.start);
  }

  /** Check if a vaccine has campaigns */
  isSupported(vaccine: VaccineType): boolean {
    const campaigns = this.get(vaccine);
    return campaigns.length > 0;
  }

  /** Get a list of all vaccine names in the schedule */
  listVaccines(): VaccineType[] {
    return Object.keys(this.schedule) as VaccineType[];
  }
}
