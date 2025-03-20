"use client";

import { createContext, useContext, ReactNode } from "react";
import { StyledVaccineContent } from "@src/services/content-api/contentStylingService";

type VaccineContentContextValueType = {
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
}: {
  children: ReactNode;
  contentPromise: Promise<StyledVaccineContent>;
}) {
  return (
    <vaccineContentContext.Provider value={{ contentPromise: contentPromise }}>
      {children}
    </vaccineContentContext.Provider>
  );
}
