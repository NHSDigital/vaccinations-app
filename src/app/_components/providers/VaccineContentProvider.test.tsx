import {
  useVaccineContentContext,
  VaccineContentProvider,
} from "@src/app/_components/providers/VaccineContentProvider";
import { renderHook } from "@testing-library/react";
import { VaccineTypes } from "@src/models/vaccine";
import React from "react";
import { mockStyledContent } from "@test-data/content-api/data";
import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import { getEligibilityForPerson } from "@src/services/eligibility-api/gateway/eligibility-filter-service";
import { mockStyledEligibility } from "@test-data/eligibility-api/data";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

jest.mock("@src/services/content-api/gateway/content-reader-service");
jest.mock("@src/services/eligibility-api/gateway/eligibility-filter-service");

let contentForVaccine: Promise<GetContentForVaccineResponse>;
let contentForEligibility: Promise<GetEligibilityForPersonResponse>;

beforeEach(() => {
  (getContentForVaccine as jest.Mock).mockResolvedValue({
    styledVaccineContent: mockStyledContent,
  });
  (getEligibilityForPerson as jest.Mock).mockResolvedValue({
    styledEligibilityContent: mockStyledEligibility,
  });
  contentForVaccine = getContentForVaccine(VaccineTypes.SIX_IN_ONE);
  contentForEligibility = getEligibilityForPerson(
    "5000000014",
    VaccineTypes.SIX_IN_ONE,
  );
});

describe("vaccine content context", () => {
  it("should throw error if context is not set", async () => {
    expect(() => {
      renderHook(() => useVaccineContentContext());
    }).toThrow("vaccine context value is null");
  });

  it("should be passed through to children", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <VaccineContentProvider
        contentForVaccine={contentForVaccine}
        contentForEligibility={contentForEligibility}
      >
        {children}
      </VaccineContentProvider>
    );

    const { result } = renderHook(() => useVaccineContentContext(), {
      wrapper,
    });
    expect(result.current.contentForVaccine).toBe(contentForVaccine);
    expect(result.current.contentForEligibility).toBe(contentForEligibility);
  });
});
