import {
  useVaccineContentContextValue,
  VaccineContentProvider,
} from "@src/app/_components/providers/vaccine-content-provider";
import { renderHook } from "@testing-library/react";
import { VaccineTypes } from "@src/models/vaccine";
import React from "react";
import {
  getStyledContentForVaccine,
  StyledVaccineContent,
} from "@src/services/content-api/parsers/content-styling-service";
import { mockStyledContent } from "@test-data/content-api/data";

jest.mock("@src/services/content-api/parsers/content-styling-service");

let contentPromise: Promise<StyledVaccineContent>;

beforeEach(() => {
  (getStyledContentForVaccine as jest.Mock).mockResolvedValue(
    mockStyledContent,
  );
  contentPromise = getStyledContentForVaccine(VaccineTypes.SIX_IN_ONE);
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
