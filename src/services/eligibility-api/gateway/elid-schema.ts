import { CONDITIONS } from "@src/models/vaccine";
import { z } from "zod";

const StatusSchema = z.enum(["NotEligible", "NotActionable", "Actionable"]);

const ConditionSchema = z.enum(CONDITIONS);

const EligibilityCohortSchema = z
  .object({
    cohortCode: z.string(),
    cohortText: z.string(),
    cohortStatus: StatusSchema,
  })
  .readonly();

const ActionSchema = z
  .object({
    actionType: z.string(), // We still want to show actions with unrecognised actionTypes - we log a warning in eligibility-filter-service.ts
    description: z.string(),
    urlLink: z
      .string()
      .optional()
      .transform((x) => x || undefined),
    urlLabel: z.string().optional(),
  })
  .readonly();

const SuitabilityRuleSchema = z
  .object({
    ruleCode: z.string(), // We still want to show rules with unrecognised codes - we log a warning in eligibility-filter-service.ts
    ruleText: z.string(),
  })
  .readonly();

const ProcessedSuggestionSchema = z
  .object({
    condition: ConditionSchema,
    status: StatusSchema,
    statusText: z.string(),
    eligibilityCohorts: z.array(EligibilityCohortSchema).default([]),
    actions: z.array(ActionSchema).default([]),
    suitabilityRules: z.array(SuitabilityRuleSchema).default([]),
  })
  .readonly();

export const EligibilityApiResponseSchema = z
  .object({
    processedSuggestions: z.array(ProcessedSuggestionSchema).default([]),
  })
  .readonly();

export type RawEligibilityApiResponse = z.infer<typeof EligibilityApiResponseSchema>;
