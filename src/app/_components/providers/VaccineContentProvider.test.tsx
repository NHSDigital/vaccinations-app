import {
  useVaccineContentContextValue,
  VaccineContentProvider,
} from "@src/app/_components/providers/VaccineContentProvider";
import { renderHook } from "@testing-library/react";
import { VaccineTypes } from "@src/models/vaccine";
import React from "react";
import { mockStyledContent } from "@test-data/content-api/data";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";

jest.mock("@src/services/content-api/gateway/content-reader-service");

let contentPromise: Promise<GetContentForVaccineResponse>;

beforeEach(() => {
  (getContentForVaccine as jest.Mock).mockResolvedValue({
    styledVaccineContent: mockStyledContent,
  });
  contentPromise = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
});

describe("vaccine content context", () => {
  it("should throw error if context is not set", async () => {
    expect(() => {
      renderHook(() => useVaccineContentContextValue());
    }).toThrow("vaccine context value is null");
  });

  it("should be passed through to children", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <VaccineContentProvider contentPromise={contentPromise}>
        {children}
      </VaccineContentProvider>
    );

    const { result } = renderHook(() => useVaccineContentContextValue(), {
      wrapper,
    });
    expect(result.current.contentPromise).toBe(contentPromise);
  });
});
