import { readFileSync, writeFileSync } from "node:fs";

import { buildGraph, buildTimeline } from "./src/processor";
import { LogEntry } from "./src/types/logs";

function loadLogs(path: string): LogEntry[] {
  const raw: string = readFileSync(path, "utf8").trim();

  if (raw.startsWith("[")) {
    return JSON.parse(raw);
  }

  return raw.split("\n").map((l) => JSON.parse(l));
}

console.log("Processing logs...");
const logsInJson = loadLogs(process.env.LOG_FILE || "logs.json");
console.log("Loaded", logsInJson.length, "log events.");

const timelineOfLogs = buildTimeline(logsInJson);
const graph = buildGraph(timelineOfLogs);
console.log("Graph built with", graph.nodes.length, "nodes and", graph.edges.length, "edges.");

writeFileSync("www/timeline.json", JSON.stringify(timelineOfLogs, null, 2));
writeFileSync("www/graph.json", JSON.stringify(graph, null, 2));
