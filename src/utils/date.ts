import { z } from "zod";

export const UtcDateFromStringSchema = z
  .string()
  .regex(/^\d{8}$/, "Date must be in YYYYMMDD format")
  .transform((str, ctx) => {
    const year = parseInt(str.slice(0, 4));
    const month = parseInt(str.slice(4, 6)); // 1-indexed (01 = Jan)
    const day = parseInt(str.slice(6, 8));
    const utcTimestamp = Date.UTC(year, month - 1, day);
    const date = new Date(utcTimestamp);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      ctx.addIssue({ code: "custom", message: "Invalid date value" });
      return z.NEVER;
    }
    return date;
  });
