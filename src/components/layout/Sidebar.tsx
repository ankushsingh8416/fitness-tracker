import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  LineChart,
  CalendarDays,
  Target,
  Sparkles,
  Settings,
  Flame,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/wellness", label: "Wellness", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-65 z-30 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border/60">
        <div className="relative h-9 w-9 rounded-xl bg-primary grid place-items-center shrink-0">
          <div className="absolute inset-0 rounded-xl bg-primary blur-lg opacity-50" />
          <Flame className="relative h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="leading-tight min-w-0">
          <div className="text-[15px] font-semibold tracking-tight truncate">Pulse Calendar</div>
          <div className="text-[11px] text-muted-foreground -mt-0.5">Fitness & Wellness</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active =
            item.to === "/" ? path === "/" : path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-sidebar-accent shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                className={`relative h-[18px] w-[18px] shrink-0 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
                strokeWidth={2}
              />
              <span
                className={`relative font-medium truncate ${
                  active ? "text-foreground" : "text-sidebar-foreground/80 group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Streak card */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
            Active streak
          </div>
          <div className="text-2xl font-bold tracking-tight">12 days</div>
          <p className="text-xs text-muted-foreground mt-1">Keep showing up — you're on fire.</p>
        </div>
      </div>
    </aside>
  );
}
