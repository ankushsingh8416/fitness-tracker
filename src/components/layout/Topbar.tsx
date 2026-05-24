import { Search, Bell, Sun, Moon, Monitor, Flame } from "lucide-react";
import { actions, useStore } from "@/store";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATIONS = [
  { title: "12-day streak — keep going!", body: "You're on a roll. Don't break the chain." },
  { title: "Hydration reminder", body: "You've had 4 of 8 glasses today." },
  { title: "Sleep average up 8%", body: "This week vs. last — great recovery." },
];

export function Topbar() {
  const profile = useStore((s) => s.profile);
  const theme = useStore((s) => s.theme);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 glass border-b border-border">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Desktop search */}
        <div className="hidden lg:flex relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search workouts, stats…"
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface border border-border text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring/40 transition"
          />
        </div>

        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary grid place-items-center">
            <Flame className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">Pulse Calendar</span>
        </div>

        <div className="flex-1 lg:hidden" />

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Theme switcher */}
          <div className="hidden sm:flex items-center rounded-full border border-border bg-surface p-0.5 gap-0.5">
            {(["light", "system", "dark"] as const).map((t) => {
              const Icon = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
              const active = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => actions.setTheme(t)}
                  className={`relative h-7 w-7 grid place-items-center rounded-full transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={`${t} theme`}
                >
                  {active && (
                    <motion.div
                      layoutId="theme-pill"
                      className="absolute inset-0 rounded-full bg-secondary shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          {/* Notifications */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative h-9 w-9 grid place-items-center rounded-xl border border-border bg-surface hover:bg-secondary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl border border-border bg-popover shadow-2xl shadow-black/10 p-2 z-50"
                >
                  <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Notifications
                  </p>
                  <div className="space-y-0.5">
                    {NOTIFICATIONS.map((n, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
                      >
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <button className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-xl border border-border bg-surface hover:bg-secondary transition-colors">
            <div
              className="h-7 w-7 rounded-lg grid place-items-center text-xs font-bold text-primary-foreground shrink-0"
              style={{ background: profile.avatarColor }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight min-w-0">
              <p className="text-xs font-semibold truncate max-w-20">
                {profile.name.split(" ")[0]}
              </p>
              <p className="text-[10px] text-muted-foreground">Pro</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
