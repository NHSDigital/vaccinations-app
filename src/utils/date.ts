import { z } from "zod";

export const UtcDateFromStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .transform((str, ctx) => {
    const year = parseInt(str.slice(0, 4));
    const month = parseInt(str.slice(5, 7)); // 1-indexed (01 = Jan)
    const day = parseInt(str.slice(8, 10));
    const utcTimestamp = Date.UTC(year, month - 1, day);
    const date = new Date(utcTimestamp);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      ctx.addIssue({ code: "custom", message: "Invalid date value" });
      return z.NEVER;
    }
    return date;
  });

export const UtcDateTimeFromStringSchema = z.iso
  .datetime({ offset: true, message: "Invalid ISO 8601 datetime format" })
  .transform((str, ctx) => {
    const date = new Date(str);

    if (isNaN(date.getTime())) {
      ctx.addIssue({ code: "custom", message: "Invalid date value" });
      return z.NEVER;
    }

    return date;
  });
