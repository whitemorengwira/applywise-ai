"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function AppShell({ children, pageTitle }: AppShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar title={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#060911] min-w-0">
          <div className="mx-auto max-w-7xl space-y-6 w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
