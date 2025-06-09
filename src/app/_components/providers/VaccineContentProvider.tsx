"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

type VaccineContentContext = {
  contentForVaccine: Promise<GetContentForVaccineResponse>;
  contentForEligibility: Promise<GetEligibilityForPersonResponse>;
};

type VaccineContentProviderProps = {
  children: ReactNode;
  contentForVaccine: Promise<GetContentForVaccineResponse>;
  contentForEligibility: Promise<GetEligibilityForPersonResponse>;
};

const vaccineContentContext = createContext<VaccineContentContext | null>(null);

export function useVaccineContentContext(): VaccineContentContext {
  const context = useContext(vaccineContentContext);
  if (context === null) {
    throw new Error("vaccine context value is null");
  }
  return context;
}

export function VaccineContentProvider({
  children,
  contentForVaccine,
  contentForEligibility,
}: Readonly<VaccineContentProviderProps>) {
  const allContent = useMemo(
    () => ({ contentForVaccine, contentForEligibility }),
    [contentForVaccine, contentForEligibility],
  );

  return (
    <vaccineContentContext.Provider value={allContent}>
      {children}
    </vaccineContentContext.Provider>
  );
}
