import { Age } from "@src/utils/auth/types";
import { differenceInYears } from "date-fns";
import { headers } from "next/headers";
import { z } from "zod";

const UtcDateFromStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .transform((str, ctx) => {
    const year = Number.parseInt(str.slice(0, 4));
    const month = Number.parseInt(str.slice(5, 7)); // 1-indexed (01 = Jan)
    const day = Number.parseInt(str.slice(8, 10));
    const utcTimestamp = Date.UTC(year, month - 1, day);
    const date = new Date(utcTimestamp);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      ctx.addIssue({ code: "custom", message: "Invalid date value" });
      return z.NEVER;
    }
    return date;
  });

const UtcDateTimeFromStringSchema = z.iso
  .datetime({ offset: true, message: "Invalid ISO 8601 datetime format" })
  .transform((str, ctx) => {
    const date = new Date(str);

    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: "custom", message: "Invalid date value" });
      return z.NEVER;
    }

    return date;
  });

const calculateAge = (date: string): Age => {
  const today: Date = new Date();
  const birthDate: Date = UtcDateFromStringSchema.parse(date);

  return differenceInYears(today, birthDate) as Age;
};

const getNow = async (): Promise<Date> => {
  if (process.env.DEPLOY_ENVIRONMENT === "prod") {
    return new Date();
  } else {
    try {
      const headersList = await headers();
      return UtcDateTimeFromStringSchema.safeParse(headersList.get("x-e2e-datetime")).data ?? new Date();
    } catch {
      return new Date();
    }
  }
};

export { UtcDateFromStringSchema, UtcDateTimeFromStringSchema, calculateAge, getNow };
