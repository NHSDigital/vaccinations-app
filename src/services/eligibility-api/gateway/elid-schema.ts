import { z } from "zod";

const StatusSchema = z.enum(["NotEligible", "NotActionable", "Actionable"]);

const ActionSchema = z
  .object({
    actionType: z.enum(["InfoText", "CardWithText", "ButtonWithAuthLink"]), // TODO SB - do we want an enum here?
    description: z.string(),
    urlLink: z.url().optional(),
    urlLabel: z.string().optional(),
  })
  .readonly();

const SuitabilityRuleSchema = z
  .object({
    ruleCode: z.enum(["AlreadyVaccinated", "NotAvailable", "NotYetDue", "TooClose", "OtherSetting"]), // TODO SB - do we want an enum here?
    ruleText: z.string(),
  })
  .readonly();

const EligibilityCohortSchema = z
  .object({
    cohortCode: z.string(),
    cohortText: z.string(),
    cohortStatus: StatusSchema,
  })
  .readonly();

const ProcessedSuggestionSchema = z
  .object({
    condition: z.enum(["RSV"]),
    status: StatusSchema,
    statusText: z.string(),
    eligibilityCohorts: z.array(EligibilityCohortSchema),
    actions: z.array(ActionSchema).default([]),
    suitabilityRules: z.array(SuitabilityRuleSchema).default([]),
  })
  .readonly();

export const EligibilityApiResponseSchema = z
  .object({
    processedSuggestions: z.array(ProcessedSuggestionSchema),
  })
  .readonly();

export type RawEligibilityApiResponse = z.infer<typeof EligibilityApiResponseSchema>;
