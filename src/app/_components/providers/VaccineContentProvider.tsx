"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { GetContentForVaccineResponse } from "@src/services/content-api/types";
import { GetEligibilityForPersonResponse } from "@src/services/eligibility-api/types";

type VaccineContentContextValueType = {
  contentPromise: Promise<GetContentForVaccineResponse>;
};

type VaccineContentProviderProps = {
  children: ReactNode;
  contentPromise: Promise<GetContentForVaccineResponse>;
  eligibilityPromise: Promise<GetEligibilityForPersonResponse>;
};

const vaccineContentContext =
  createContext<VaccineContentContextValueType | null>(null);

export function useVaccineContentContextValue(): VaccineContentContextValueType {
  const contextValue = useContext(vaccineContentContext);
  if (contextValue === null) {
    throw new Error("vaccine context value is null");
  }
  return contextValue;
}

export function VaccineContentProvider({
  children,
  contentPromise,
  eligibilityPromise,
}: Readonly<VaccineContentProviderProps>) {
  const contentPromiseProp = useMemo(
    () => ({ contentPromise: contentPromise }),
    [contentPromise],
  );

  return (
    <vaccineContentContext.Provider value={contentPromiseProp}>
      {children}
    </vaccineContentContext.Provider>
  );
}
