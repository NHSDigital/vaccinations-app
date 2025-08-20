import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineTypes } from "@src/models/vaccine";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");

describe("invalidateCacheForVaccine", () => {
  it("should call writer service with empty data for given vaccine", async () => {
    (writeContentForVaccine as jest.Mock).mockImplementation(() => {});

    const vaccine = VaccineTypes.RSV;
    await invalidateCacheForVaccine(vaccine);

    expect(writeContentForVaccine).toHaveBeenCalledWith(vaccine, "{}");
  });

  it("should propagate errors thrown by writer service", async () => {
    const writerError: string = "writer-error";
    (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error(writerError));

    await expect(invalidateCacheForVaccine(VaccineTypes.RSV)).rejects.toThrow(writerError);
  });
});
