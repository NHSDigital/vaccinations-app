"use client";

import { useNavigationTransition } from "@src/app/_components/context/NavigationContext";
import Link from "next/link";
import { MouseEvent } from "react";

// This is a reusable Link component that can be used to prevent multiple clicks.
export function TransitionLink({
  href,
  children,
  className,
  target,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}) {
  const { navigate, isPending } = useNavigationTransition();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-disabled={isPending}
      className={className}
      prefetch={false}
      target={target}
    >
      {children}
    </Link>
  );
}
