import { z } from "zod";

const StatusSchema = z.enum(["NotEligible", "NotActionable", "Actionable"]);

const ActionFromApiSchema = z.object({
  actionType: z.enum(["InfoText", "CardWithText", "ButtonWithAuthLink"]),
  actionCode: z.enum(["HealthcareProInfo", "BookNBS", "CheckCorrect"]),
  description: z.string(),
});

const EligibilityCohortSchema = z.object({
  cohortCode: z.string(),
  cohortText: z.string(),
  cohortStatus: StatusSchema,
});

const ProcessedSuggestionSchema = z.object({
  condition: z.literal("RSV"),
  status: StatusSchema,
  statusText: z.string(),
  eligibilityCohorts: z.array(EligibilityCohortSchema),
  actions: z.array(ActionFromApiSchema),
});

export const EligibilityApiResponseSchema = z.object({
  processedSuggestions: z.array(ProcessedSuggestionSchema),
});

export type RawEligibilityApiResponse = z.infer<typeof EligibilityApiResponseSchema>;
