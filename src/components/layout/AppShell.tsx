import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-65 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <footer className="hidden lg:flex items-center justify-center h-10 border-t border-border px-6">
          <p className="text-xs text-muted-foreground">
            Made with{" "}
            <span className="text-rose-500" aria-label="love">
              ❤️
            </span>{" "}
            by{" "}
            <span className="font-medium text-foreground">Kajal</span>
          </p>
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}
