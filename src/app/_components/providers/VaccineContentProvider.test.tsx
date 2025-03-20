import {
  useVaccineContentContextValue,
  VaccineContentProvider,
} from "@src/app/_components/providers/VaccineContentProvider";
import { renderHook } from "@testing-library/react";
import {
  getPageCopyForVaccine,
  VaccinePageContent,
} from "@src/services/content-api/contentFilter";
import { VaccineTypes } from "@src/models/vaccine";
import React from "react";

jest.mock("@src/services/content-api/contentFilter");

const mockContent = {
  overview: "Overview text",
  whatVaccineIsFor: {
    heading: "what-heading",
    text: "<p data-testid='what-text-paragraph'>what-text</p>",
  },
  whoVaccineIsFor: {
    heading: "who-heading",
    text: "<p data-testid='who-text-paragraph'>who-text</p>",
  },
  howToGetVaccine: {
    heading: "how-heading",
    text: "<p data-testid='how-text-paragraph'>how-text</p>",
  },
  webpageLink: "https://www.test.com/",
};

let contentPromise: Promise<VaccinePageContent>;

beforeEach(() => {
  (getPageCopyForVaccine as jest.Mock).mockResolvedValue(mockContent);
  contentPromise = getPageCopyForVaccine(VaccineTypes.SIX_IN_ONE);
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
