import { fetchContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-fetcher";
import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { handler } from "@src/_lambda/content-cache-hydrator/handler";

jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");
jest.mock("@src/_lambda/content-cache-hydrator/content-fetcher");

describe("Lambda Handler", () => {
  it("returns 200 when cache hydration is successful", async () => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (writeContentForVaccine as jest.Mock).mockResolvedValue(undefined);

    await expect(handler({})).resolves.toBeUndefined();
  });

  it("returns 500 when cache hydration has failed", async () => {
    (fetchContentForVaccine as jest.Mock).mockResolvedValue(undefined);
    (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error("test"));

    await expect(handler({})).rejects.toThrow("2 failures");
  });
});
