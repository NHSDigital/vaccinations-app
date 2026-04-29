/**
 * Logic for extracting Splunk logs from the DOM, grouping them by session/trace,
 * and building the graph data structure (nodes and edges).
 */
import DeviceDetector from "device-detector-js";

import { LogEntry, LogNode } from "./types/logs.js";
import { getMessageAndContext, mapMessageToNodeLabel, parseTimestamp } from "./utils";

const detector = new DeviceDetector();

export function buildTimeline(logs: LogEntry[]) {
  logs.forEach((l: LogEntry): string => (l.__ts = parseTimestamp(l) || new Date().toISOString()));
  return logs.sort((a: LogEntry, b: LogEntry) => new Date(a.__ts).getTime() - new Date(b.__ts).getTime());
}

function getTraceId(log: LogEntry) {
  return log.result.traceId || log.result.message?.traceId || log.result["message.traceId"] || undefined;
}

function getSessionIdOrUnknown(log: LogEntry) {
  return log.result.sessionId || log.result.message?.sessionId || log.result["message.sessionId"] || undefined;
}

function getRequestId(log: LogEntry) {
  return log.result.requestId || log.result.record?.requestId || log.result["record.requestId"] || undefined;
}

function getModule(log: LogEntry): string | undefined {
  return log.result.module || log.result.message?.module || log.result["message.module"] || undefined;
}

function getLogLevel(log: LogEntry): string | undefined {
  return log.result.level || log.result.message?.level || log.result["message.level"] || undefined;
}

function getUserAgent(log: LogEntry): string | undefined {
  return log.result.message?.context?.headers?.["user-agent"] || log.result["message.context.headers.user-agent"];
}

function groupLogsBySessionTraceOrRequest(logs: LogEntry[]) {
  // Map each identifier to the logs that contain it
  const idToLogs = new Map<string, LogEntry[]>();

  logs.forEach((log: LogEntry) => {
    const traceId = getTraceId(log);
    const sessionIdOrUnknown = getSessionIdOrUnknown(log);
    const sessionId = sessionIdOrUnknown === "unknown-session-id" ? undefined : sessionIdOrUnknown;
    const requestId = getRequestId(log);

    const ids = [sessionId, traceId, requestId].filter(Boolean) as string[];

    ids.forEach((id: string): void => {
      if (!idToLogs.has(id)) {
        idToLogs.set(id, []);
      }
      idToLogs.get(id)!.push(log);
    });
  });

  // Union-Find helpers
  const parent = new Map<LogEntry, LogEntry>();

  function find(entry: LogEntry): LogEntry {
    if (parent.get(entry) === entry) return entry;
    const root = find(parent.get(entry)!);
    parent.set(entry, root);
    return root;
  }

  function union(a: LogEntry, b: LogEntry) {
    parent.set(find(a), find(b));
  }

  // Initial parent assignment
  logs.forEach((log: LogEntry): void => {
    parent.set(log, log);
  });

  // Union logs sharing ids
  for (const group of idToLogs.values()) {
    const [first, ...rest] = group;
    for (const e of rest) {
      union(first, e);
    }
  }

  // Build final groups by root parent
  const groups = new Map<LogEntry, LogEntry[]>();

  logs.forEach((log: LogEntry) => {
    const root = find(log);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(log);
  });

  return Array.from(groups.values());
}

export function buildGraph(timeline: LogEntry[]) {
  const groups: LogEntry[][] = groupLogsBySessionTraceOrRequest(timeline);

  const nodes: LogNode[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edges: any[] = [];
  let uid: number = 0;

  groups.forEach((logs: LogEntry[], index: number) => {
    const events: LogEntry[] = logs.sort((a, b) => new Date(a.__ts).getTime() - new Date(b.__ts).getTime());

    const gid = `group:${index}`;
    let prevId: string = gid;
    let x: number = 0;
    let y: number = 0;

    nodes.push({
      id: gid,
      label: "Start",
      millisSinceEpoch: 0,
      color: "#66545e",
      font: {
        color: "#ffffff",
      },
      shape: "circle",
      info: { start: true },
      module: "",
      context: "",
      device: undefined,
      size: 5,
      x: 0,
      y: 0,
    });

    for (const e of events) {
      const messageAndContext = getMessageAndContext(e);
      let nodeLabel = mapMessageToNodeLabel(messageAndContext[0]);
      let nodeContext = messageAndContext[1];
      const isLatencyNode = nodeLabel.search("Performance-Profile") >= 0;
      const hasError = getLogLevel(e) === "ERROR" || nodeLabel.search(/Error/i) >= 0;
      const userAgent = getUserAgent(e);
      const nhsAppPart = userAgent
        ? userAgent.indexOf("nhsapp-android") >= 0
          ? { isOpenInNHSApp: "android" }
          : userAgent.indexOf("nhsapp-ios") >= 0
            ? { isOpenInNHSApp: "ios" }
            : { isOpenInNHSApp: "no" }
        : undefined;
      const deviceDetectorPart = userAgent ? detector.parse(userAgent) : undefined;
      const device = userAgent ? { ...nhsAppPart, ...deviceDetectorPart } : undefined;

      if (isLatencyNode) {
        nodeLabel = messageAndContext[1];
        nodeContext = messageAndContext[0];
      }

      const id = `${gid}:${e.__ts}:${nodeLabel}:${uid++}`;
      nodes.push({
        id,
        label: nodeLabel,
        millisSinceEpoch: new Date(e.__ts).getTime(),
        module: getModule(e) || "unknown-module",
        context: nodeContext,
        color: isLatencyNode ? "#ffffff" : hasError ? "#eea990" : "#f6e0b5",
        shape: isLatencyNode ? "ellipse" : "box",
        info: e.result,
        size: isLatencyNode ? 10 : 20,
        x: x,
        y: y,
        device: device,
      });

      if (prevId != gid) {
        const latencyMs = nodes[nodes.length - 1].millisSinceEpoch - nodes[nodes.length - 2].millisSinceEpoch;
        edges.push({ from: prevId, to: id, traceId: gid, label: latencyMs + "ms" });
      } else {
        edges.push({ from: prevId, to: id, traceId: gid, label: "start" });
      }

      prevId = id;

      x += 200;
      if (x > 1000) {
        x = 0;
        y += 200;
      }
    }
  });

  return { nodes, edges };
}

export function extractLogsFromDOM(): LogEntry[] {
  const rows = document.getElementsByClassName("raw-event");
  return Array.from(rows).map((row) => {
    return { result: JSON.parse(row.textContent || "{}") };
  });
}
