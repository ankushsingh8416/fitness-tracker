import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Dumbbell, LineChart, CalendarDays, Sparkles } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/analytics", label: "Stats", icon: LineChart },
  { to: "/calendar", label: "Cal", icon: CalendarDays },
  { to: "/wellness", label: "Wellness", icon: Sparkles },
];

export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-1 py-1.5"
            >
              <Icon
                className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-[10px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
