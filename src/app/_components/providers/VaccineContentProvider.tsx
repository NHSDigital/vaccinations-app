"use client";

import { ContentApiVaccineResponse } from "@src/services/content-api/parsers/content-filter-service";
import { createContext, useContext, ReactNode, useMemo } from "react";

type VaccineContentContextValueType = {
  contentPromise: Promise<ContentApiVaccineResponse>;
};

type VaccineContentProviderProps = {
  children: ReactNode;
  contentPromise: Promise<ContentApiVaccineResponse>;
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
