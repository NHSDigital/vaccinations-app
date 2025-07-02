import { VaccineTypes } from "@src/models/vaccine";
import { getVaccineTypeFromUrlPath, isS3Path } from "@src/utils/path";

describe("path", () => {
  describe("isS3Path()", () => {
    it("returns true when path is an s3 path", async () => {
      expect(isS3Path("s3://bucket/file")).toBeTruthy();
    });

    it("returns false when path is local path", async () => {
      expect(isS3Path("some/local/file")).toBeFalsy();
    });
  });

  describe("getVaccineTypeFromUrlPath()", () => {
    it("returns undefined when path does not exist", async () => {
      expect(getVaccineTypeFromUrlPath("test-vaccine")).toBeUndefined();
    });
    it("returns vaccine type corresponding to the path", async () => {
      expect(getVaccineTypeFromUrlPath("rsv")).toBe(VaccineTypes.RSV);
      expect(getVaccineTypeFromUrlPath("rsv-pregnancy")).toBe(VaccineTypes.RSV_PREGNANCY);
    });
  });
});
