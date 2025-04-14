import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";
import type { HydrateResponse } from "@src/_lambda/content-cache-hydrator/handler";
import configProvider from "@src/utils/config";

jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");
jest.mock("@src/utils/config");

describe("Lambda Handler", () => {
  (configProvider as jest.Mock).mockImplementation(() => ({
    CONTENT_CACHE_PATH: "wiremock/__files/",
  }));

  it("returns 200 when cache hydration is successful", async () => {
    (writeContentForVaccine as jest.Mock).mockResolvedValue(undefined);

    const actual: HydrateResponse = await handler({} as never);
    expect(actual.statusCode).toEqual(200);
  });

  it("returns 500 when cache hydration has failed", async () => {
    (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

    const actual: HydrateResponse = await handler({} as never);
    expect(actual.statusCode).toEqual(500);
  });
});
