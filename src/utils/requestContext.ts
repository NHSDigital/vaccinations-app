import { AsyncLocalStorage } from "async_hooks";

export type RequestContext = {
  traceId: string;
  nextUrl: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export { asyncLocalStorage };
