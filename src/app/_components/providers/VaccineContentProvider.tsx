"use client";

import { createContext, useContext, ReactNode } from "react";
import { VaccinePageContent } from "@src/services/content-api/contentFilter";

type VaccineContentContextType = {
  contentPromise: Promise<VaccinePageContent>;
};

const VaccineContentContext = createContext<VaccineContentContextType | null>(
  null,
);

export function useVaccineContent(): VaccineContentContextType {
  const context = useContext(VaccineContentContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function VaccineContentProvider({
  children,
  contentPromise,
}: {
  children: ReactNode;
  contentPromise: Promise<VaccinePageContent>;
}) {
  return (
    <VaccineContentContext.Provider value={{ contentPromise: contentPromise }}>
      {children}
    </VaccineContentContext.Provider>
  );
}
