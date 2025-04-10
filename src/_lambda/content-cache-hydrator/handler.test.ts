import writeContentToCache from "@src/_lambda/content-cache-hydrator/content-cache-writer";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";
import type {
  HydrateEvent,
  HydrateResponse,
} from "@src/_lambda/content-cache-hydrator/handler";

jest.mock("@src/_lambda/content-cache-hydrator/content-cache-writer");

describe("Lambda Handler", () => {
  it("returns 200 when cache hydration is successful", async () => {
    (writeContentToCache as jest.Mock).mockResolvedValue(undefined);

    const actual: HydrateResponse = await handler({
      name: "test",
      value: 0,
    } as HydrateEvent);
    expect(actual.statusCode).toEqual(200);
  });

  it("returns 500 when cache hydration has failed", async () => {
    (writeContentToCache as jest.Mock).mockRejectedValue(new Error("test"));

    const actual: HydrateResponse = await handler({
      name: "test",
      value: 0,
    } as HydrateEvent);
    expect(actual.statusCode).toEqual(500);
  });
});
