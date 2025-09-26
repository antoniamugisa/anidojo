"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const demo = process.env.NEXT_PUBLIC_DEMO === "1";
  if (demo) return <>{children}</>;
  return <SessionProvider>{children}</SessionProvider>;
}
