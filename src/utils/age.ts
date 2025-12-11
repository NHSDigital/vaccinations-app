import { UtcDateFromStringSchema } from "@src/utils/date";
import { differenceInYears } from "date-fns";

export const calculateAge = (date: string): number => {
  const today: Date = new Date();
  const birthDate: Date = UtcDateFromStringSchema.parse(date);

  return differenceInYears(today, birthDate);
};
