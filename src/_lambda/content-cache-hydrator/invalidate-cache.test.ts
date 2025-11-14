import { writeContentForVaccine } from "@src/_lambda/content-cache-hydrator/content-writer-service";
import { invalidateCacheForVaccine } from "@src/_lambda/content-cache-hydrator/invalidate-cache";
import { VaccineType } from "@src/models/vaccine";
import { INVALIDATED_CONTENT_OVERWRITE_VALUE } from "@src/services/content-api/constants";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/_lambda/content-cache-hydrator/content-writer-service");

describe("invalidateCacheForVaccine", () => {
  it("should call writer service with empty data for given vaccine", async () => {
    (writeContentForVaccine as jest.Mock).mockImplementation(() => {});

    const vaccine = VaccineType.RSV;
    await invalidateCacheForVaccine(vaccine);

    expect(writeContentForVaccine).toHaveBeenCalledWith(vaccine, INVALIDATED_CONTENT_OVERWRITE_VALUE);
  });

  it("should propagate errors thrown by writer service", async () => {
    const writerError: string = "writer-error";
    (writeContentForVaccine as jest.Mock).mockRejectedValue(new Error(writerError));

    await expect(invalidateCacheForVaccine(VaccineType.RSV)).rejects.toThrow(writerError);
  });
});
