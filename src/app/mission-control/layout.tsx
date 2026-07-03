import * as React from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { CommandK } from "@/components/shared/CommandK";
import { Bell, Sun } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Panel */}
      <AppSidebar />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Dashboard Top header bar */}
        <header className="h-16 border-b border-border bg-card/45 backdrop-blur-md px-6 md:px-8 flex items-center justify-between shrink-0 select-none z-10">
          <div>
            <h1 className="text-base font-semibold text-foreground font-heading tracking-tight">Academic OS</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Spotlight shortcut */}
            <CommandK />

            {/* Notification bell button */}
            <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            </button>

            {/* Simple Light/Dark Switch (static preview for now) */}
            <button className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer">
              <Sun size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Subpage Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
