"use client";

import { useNavigationTransition } from "@src/app/_components/context/NavigationContext";
import LoadingSpinner from "@src/app/_components/loader/LoadingSpinner";
import Link from "next/link";
import { MouseEvent } from "react";

// This is a reusable Link component that can be used to prevent multiple clicks.
export function TransitionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { navigate, pendingUrl } = useNavigationTransition();
  const isLoading = pendingUrl === href; // Ensure loading is detected only for the same url

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={onClick} aria-disabled={isLoading} className={className} prefetch={false}>
      {children}
      {isLoading && <LoadingSpinner />}
    </Link>
  );
}
