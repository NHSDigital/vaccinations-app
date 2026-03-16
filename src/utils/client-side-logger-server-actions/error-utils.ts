import validator from "validator";

const MAX_FIELD_LENGTH = 2000;
const ALLOWED_CONTEXT_KEYS = ["message", "stack", "digest", "filename", "lineno", "colno"] as const;

const _sanitiseErrorContext = (rawContext?: unknown): Record<string, string> | undefined => {
  if (!rawContext || typeof rawContext !== "object") return undefined;

  const sanitisedContext: Record<string, string> = {};
  const raw = rawContext as Record<string, unknown>;

  for (const key of ALLOWED_CONTEXT_KEYS) {
    const value = raw[key];

    if (typeof value === "string") {
      let cleaned = validator.stripLow(value);
      if (cleaned.length > MAX_FIELD_LENGTH) {
        cleaned = cleaned.slice(0, MAX_FIELD_LENGTH);
      }

      sanitisedContext[key] = validator.escape(cleaned);
    }
  }

  return Object.keys(sanitisedContext).length > 0 ? sanitisedContext : undefined;
};

export { _sanitiseErrorContext };
