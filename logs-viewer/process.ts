import DeviceDetector from "device-detector-js";
import { readFileSync, writeFileSync } from "node:fs";

import { LogEntry, LogNode } from "./types";
import { getMessageAndContext, mapMessageToNodeLabel, parseTimestamp } from "./utils.js";

const detector = new DeviceDetector();

function loadLogs(path: string): LogEntry[] {
  const raw: string = readFileSync(path, "utf8").trim();

  if (raw.startsWith("[")) {
    return JSON.parse(raw);
  }

  return raw.split("\n").map((l) => JSON.parse(l));
}

function buildTimeline(logs: LogEntry[]) {
  logs.forEach((l: LogEntry): string => (l.__ts = parseTimestamp(l)));
  return logs.sort((a: LogEntry, b: LogEntry) => new Date(a.__ts).getTime() - new Date(b.__ts).getTime());
}

function groupLogsBySessionTraceOrRequest(logs: LogEntry[]) {
  // Map each identifier to the logs that contain it
  const idToLogs = new Map<string, LogEntry[]>();

  logs.forEach((log: LogEntry) => {
    const traceId = log.result.traceId || log.result["message.traceId"] || undefined;
    const sessionIdOrUnknown = log.result.sessionId || log.result["message.sessionId"] || undefined;
    const sessionId = sessionIdOrUnknown === "unknown-session-id" ? undefined : sessionIdOrUnknown;
    const requestId = log.result.requestId || log.result["record.requestId"] || undefined;

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

function buildGraph(timeline: LogEntry[]) {
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
      const hasError =
        e.result.level === "ERROR" || e.result["message.level"] === "ERROR" || nodeLabel.search(/Error/i) >= 0;
      const userAgent = e.result["message.context.headers.user-agent"];
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
        module: e.result.module || e.result["message.module"],
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

console.log("Processing logs...");
const logsInJson = loadLogs(process.env.LOG_FILE || "logs.json");
console.log("Loaded", logsInJson.length, "log events.");

const timelineOfLogs = buildTimeline(logsInJson);
const graph = buildGraph(timelineOfLogs);
console.log("Graph built with", graph.nodes.length, "nodes and", graph.edges.length, "edges.");

writeFileSync("www/timeline.json", JSON.stringify(timelineOfLogs, null, 2));
writeFileSync("www/graph.json", JSON.stringify(graph, null, 2));
