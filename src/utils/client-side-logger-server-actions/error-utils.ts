const MAX_FIELD_LENGTH = 2000;
const ALLOWED_CONTEXT_KEYS: string[] = ["message", "stack", "digest", "filename", "lineno", "colno"];

const _sanitiseErrorContext = (rawContext?: unknown): Record<string, string> | undefined => {
  if (rawContext == null || typeof rawContext !== "object") return undefined;

  const sanitisedContext: Record<string, string> = {};
  const raw = rawContext as Record<string, unknown>;

  for (const key of ALLOWED_CONTEXT_KEYS) {
    if (key in raw && typeof raw[key] === "string") {
      sanitisedContext[key] = (raw[key] as string)
        .slice(0, MAX_FIELD_LENGTH)
        // Only allow 'tab', 'newline', 'return' control characters
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
    }
  }

  return Object.keys(sanitisedContext).length > 0 ? sanitisedContext : undefined;
};

export { _sanitiseErrorContext };
