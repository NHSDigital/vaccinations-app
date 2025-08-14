import { AsyncLocalStorage } from "async_hooks";

export type RequestContext = {
  traceId: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export { asyncLocalStorage };
