import { isS3Path } from "@src/utils/path";

describe("isS3Path()", () => {
  it("returns true when path is an s3 path", async () => {
    expect(isS3Path("s3://bucket/file")).toBeTruthy();
  });

  it("returns false when path is local path", async () => {
    expect(isS3Path("some/local/file")).toBeFalsy();
  });
});
