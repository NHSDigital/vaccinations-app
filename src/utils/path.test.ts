import { VaccineType } from "@src/models/vaccine";
import { getVaccineTypeFromLowercaseString, isS3Path } from "@src/utils/path";

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
      expect(getVaccineTypeFromLowercaseString("test-vaccine")).toBeUndefined();
    });
    it("returns vaccine type corresponding to the path", async () => {
      expect(getVaccineTypeFromLowercaseString("rsv")).toBe(VaccineType.RSV);
      expect(getVaccineTypeFromLowercaseString("rsv-pregnancy")).toBe(VaccineType.RSV_PREGNANCY);
    });
  });
});
