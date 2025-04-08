import { S3Client } from "@aws-sdk/client-s3";
import mockRsvVaccineJson from "@project/wiremock/__files/rsv-vaccine.json";
import readContentFromCache from "@src/services/content-api/cache/reader/content-cache-reader";
import { Readable } from "stream";

jest.mock("@aws-sdk/client-s3");

describe("readContentFromCache()", () => {
  const mockSend = jest.fn();
  beforeEach(() => {
    (S3Client as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
  });

  it("returns content when object uri is local", async () => {
    const actual = await readContentFromCache(
      "wiremock/__files",
      "/rsv-vaccine.json",
    );
    expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
  });

  it("returns content when object uri is remote", async () => {
    mockSend.mockImplementation(() => ({
      Body: new Readable({
        read() {
          this.push(JSON.stringify(mockRsvVaccineJson));
          this.push(null); // End of stream
        },
      }),
    }));

    const actual = await readContentFromCache("s3://bucket", "/file");
    expect(JSON.parse(actual)).toStrictEqual(mockRsvVaccineJson);
  });

  it("throws when remote response is invalid", async () => {
    mockSend.mockImplementation(() => ({
      Body: {},
    }));

    const actualPromise = readContentFromCache("s3://bucket", "/file");
    await expect(actualPromise).rejects.toThrow("Unexpected response type");
  });

  it("throws when remote response has error", async () => {
    mockSend.mockImplementation(() => ({
      Body: new Readable({
        read() {
          this.emit("error", new Error("test error"));
        },
      }),
    }));

    const actualPromise = readContentFromCache("s3://bucket", "/file");
    await expect(actualPromise).rejects.toThrow("test error");
  });
});
