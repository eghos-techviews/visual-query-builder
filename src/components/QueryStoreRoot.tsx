"use client";
// Thin client wrapper so the store hydrates correctly in the App Router
export function QueryStoreRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
