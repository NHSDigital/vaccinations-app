import "@testing-library/jest-dom";
import { performance as nodePerf } from "perf_hooks";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof globalThis.performance.mark !== "function") {
  Object.defineProperty(globalThis.performance, "mark", {
    value: nodePerf.mark.bind(nodePerf),
    configurable: true,
    writable: true,
  });
}

if (typeof globalThis.performance.measure !== "function") {
  Object.defineProperty(globalThis.performance, "measure", {
    value: nodePerf.measure.bind(nodePerf),
    configurable: true,
    writable: true,
  });
}
