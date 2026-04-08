/* eslint-disable  @typescript-eslint/no-explicit-any */

interface LogEntry {
  result: {
    time?: number;
    timestamp?: string;
    _time?: string;
    traceId?: string;
    sessionId?: string;
    module?: string;
    message?: any;
    msg?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface LogNode {
  id: string;
  label: string;
  millisSinceEpoch: number;
  color: string;
  font?: object;
  shape: "circle" | "box" | "ellipse";
  info: object;
  module: string;
  context: string;
  device: object | undefined;
  size: number;
  x: number;
  y: number;
}

export type { LogEntry, LogNode };
