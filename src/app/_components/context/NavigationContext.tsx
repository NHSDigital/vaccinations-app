"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";

type NavigationContextType = {
  navigate: (href: string) => void;
  isPending: boolean;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    if (isPending) return;

    startTransition(() => {
      router.push(href);
    });
  };

  return <NavigationContext.Provider value={{ navigate, isPending }}>{children}</NavigationContext.Provider>;
};

const useNavigationTransition = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigationTransition must be used inside NavigationProvider");
  return context;
};

export { useNavigationTransition, NavigationProvider };
