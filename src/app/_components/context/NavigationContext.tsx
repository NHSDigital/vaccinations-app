"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useTransition } from "react";

type NavigationContextType = {
  navigate: (href: string) => void;
  pendingUrl: string | null;
  isPending: boolean;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const navigate = (href: string) => {
    if (isPending && pendingUrl === href) return;

    setPendingUrl(href);

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <NavigationContext.Provider value={{ navigate, isPending, pendingUrl: isPending ? pendingUrl : null }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigationTransition = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigationTransition must be used inside NavigationProvider");
  return context;
};

export { useNavigationTransition, NavigationProvider };
