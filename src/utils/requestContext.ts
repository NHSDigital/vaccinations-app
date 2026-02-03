import { AsyncLocalStorage } from "async_hooks";

export type RequestContext = {
  traceId: string;
  nextUrl: string;
  sessionId: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export { asyncLocalStorage };
