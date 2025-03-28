"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { StyledVaccineContent } from "@src/services/content-api/parsers/contentStylingService";

type VaccineContentContextValueType = {
  contentPromise: Promise<StyledVaccineContent>;
};

type VaccineContentProviderProps = {
  children: ReactNode;
  contentPromise: Promise<StyledVaccineContent>;
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
