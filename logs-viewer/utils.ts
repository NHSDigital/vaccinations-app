import { LogEntry } from "./types";

const messageMap: { regex: RegExp; label: string }[] = [
  { regex: /Latency/i, label: "Performance-Profile" },
  { regex: /Lambda/i, label: "Lambda" },
  { regex: /loaded from cache/i, label: "Loaded vaccine content" },
  { regex: /Fetching eligibility status/i, label: "Fetching eligibility" },
  { regex: /SSO route invoked/i, label: "SSO jumpoff" },
  { regex: /NHS-Login callback/i, label: "NHS login callback" },
  { regex: /HTTP status error/i, label: "HTTPError" },
  { regex: /Inspecting request/i, label: "Middleware" },
  { regex: /Preparing to fetch-eligibility-content/i, label: "Read APIM access token" },
  { regex: /APIM access token fetched/i, label: "Fetched APIM access token" },
  { regex: /Eligibility status retrieved/i, label: "Fetched eligibility" },
  { regex: /Eligibility status data validated/i, label: "Validated eligibility" },
  { regex: /First APIM token fetched/i, label: "Fetched first APIM access token" },
  { regex: /New APIM token fetched/i, label: "Fetched new APIM access token" },
  { regex: /APIM token expires soon/i, label: "ExpiresSoon APIM access token" },
  { regex: /Error from NextAuth/i, label: "NextAuthError" },
  { regex: /Error fetching APIM credentials/i, label: "APIMAuthError" },
  { regex: /Error calling APIM token endpoint/i, label: "APIMTokenEndpointError" },
  { regex: /SSO-to-NBS jump off route invoked/i, label: "SSO-to-NBS jumpoff" },
  { regex: /NBS SSO setup success/i, label: "SSO-to-NBS redirect" },
  { regex: /Missing user session/i, label: "No user session" },
  { regex: /Rendering client-side page/i, label: "Client page" },
  { regex: /reset cache/i, label: "Reset cache" },
  { regex: /Client side error occurred/i, label: "ClientSideError" },
  { regex: /Error in getting secret from SecretsManager/i, label: "SecretsManagerError" },
  { regex: /Content changed since last approved/i, label: "CacheInvalidationError" },

  // Add more as needed...
];

const getMessageAndContext = (entry: LogEntry): [string, string] => {
  let context: string = "";
  let message: string = "unknown";

  if (entry.result.msg) {
    message = entry.result.msg;
    if (entry.result.msg.includes("performance profile")) {
      message = "Latency " + parseInt(entry.result["context.message.latencyMillis"]) + " ms";
      context = entry.result["context.message.marker"];
    }
    return [message, context];
  }

  if (entry.result["message.msg"] && typeof entry.result["message.msg"] === "string") {
    message = entry.result["message.msg"];
    if (entry.result["message.msg"].includes("performance profile")) {
      message = "Latency " + parseInt(entry.result["message.context.message.latencyMillis"]) + " ms";
      context = entry.result["message.context.message.marker"];
    }
    return [message, context];
  }

  if (entry.result.type && entry.result.type.indexOf("platform.") >= 0) {
    return ["Lambda", ""];
  }

  return [message, context];
};

const mapMessageToNodeLabel = (msg: string): string => {
  for (const rule of messageMap) {
    if (rule.regex.test(msg)) {
      return rule.label;
    }
  }
  console.log("No match found, consider adding one to messageMap:", msg);
  return msg;
};

const parseTimestamp = (e: LogEntry): string => {
  if (typeof e.result.time === "number") {
    return new Date(e.result.time).toISOString();
  }

  const timestamp = e.result.timestamp || e.result._time || undefined;
  if (!timestamp) {
    console.log("No timestamp found in log entry:", e);
    process.exit(1);
  }

  const d = new Date(timestamp);
  if (isNaN(d.getTime())) {
    console.error("❌ Invalid timestamp:", timestamp);
    process.exit(1);
  }

  return d.toISOString();
};

export { getMessageAndContext, mapMessageToNodeLabel, parseTimestamp };
