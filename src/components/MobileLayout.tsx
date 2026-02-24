"use client";

import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-dawn-background flex flex-col mx-auto max-w-md">
      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
