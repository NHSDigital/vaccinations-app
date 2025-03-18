"use client";

import { createContext, useContext, ReactNode } from "react";

type ContentContextType = {
  contentPromise: Promise<any>;
};

const ContentContext = createContext<ContentContextType | null>(null);

export function useContent(): ContentContextType {
  const context = useContext(ContentContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function ContentProvider({
  children,
  contentPromise,
}: {
  children: ReactNode;
  contentPromise: Promise<any>;
}) {
  return (
    <ContentContext.Provider value={{ contentPromise: contentPromise }}>
      {children}
    </ContentContext.Provider>
  );
}
