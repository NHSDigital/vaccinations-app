import { extractRootTraceIdFromAmznTraceId } from "@src/utils/logger";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("extractRootTraceIdFromAmznTraceId", () => {
  it("should extract TraceID root from longer AWS Trace Id string", () => {
    const amznTraceId =
      "Root=1-68557034-317ef01c7e77ec2d5f31e4bb;Parent=28e363d17cb3d67b;Sampled=0;Lineage=1:a14f8d3b:0";

    const traceIdRoot = extractRootTraceIdFromAmznTraceId(amznTraceId);

    expect(traceIdRoot).toEqual("1-68557034-317ef01c7e77ec2d5f31e4bb");
  });

  it("should return undefined if root not found in full traceId string", () => {
    const invalidAmznTraceId = "not-the-correct-format";

    const traceIdRoot = extractRootTraceIdFromAmznTraceId(invalidAmznTraceId);

    expect(traceIdRoot).toBeUndefined();
  });
});
