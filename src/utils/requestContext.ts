import { AsyncLocalStorage } from "async_hooks";

export type RequestContext = {
  requestId: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export { asyncLocalStorage };
