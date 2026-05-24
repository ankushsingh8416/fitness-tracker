import { useMemo, useState } from "react";
import { useStore } from "@/store";
import { CATEGORY_META } from "@/lib/categories";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { motion } from "framer-motion";

export function CalendarView() {
  const workouts = useStore((s) => s.workouts);
  const stats = useStore((s) => s.stats);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string>(new Date().toISOString().slice(0, 10));

  const days = useMemo(() => buildMonth(cursor), [cursor]);
  const byDate = useMemo(() => {
    const m = new Map<string, typeof workouts>();
    workouts.forEach((w) => {
      const arr = m.get(w.date) ?? [];
      arr.push(w);
      m.set(w.date, arr);
    });
    return m;
  }, [workouts]);

  const streak = useMemo(() => {
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const has = workouts.some((w) => w.date === iso && w.completed);
      if (has) s++;
      else if (i > 0) break;
    }
    return s;
  }, [workouts]);

  const selectedWorkouts = byDate.get(selected) ?? [];
  const selectedStat = stats.find((s) => s.date === selected);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Your training rhythm, at a glance.</p>
        </div>
        <div className="soft-card px-5 py-3 inline-flex items-center gap-3">
          <Flame className="h-5 w-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Current streak</div>
            <div className="text-xl font-semibold tabular-nums">{streak} days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 soft-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-tight">
              {cursor.toLocaleDateString("en", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="h-9 w-9 grid place-items-center rounded-xl hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="h-9 w-9 grid place-items-center rounded-xl hover:bg-secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const iso = d.toISOString().slice(0, 10);
              const ws = byDate.get(iso) ?? [];
              const completed = ws.some((w) => w.completed);
              const isToday = iso === new Date().toISOString().slice(0, 10);
              const isSel = iso === selected;
              return (
                <motion.button
                  key={iso}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelected(iso)}
                  className={`aspect-square rounded-xl p-1.5 flex flex-col items-center justify-between relative transition-colors ${isSel ? "bg-primary text-primary-foreground" : "hover:bg-secondary"} ${isToday && !isSel ? "ring-1 ring-primary/40" : ""}`}
                >
                  <span className="text-xs font-medium tabular-nums">{d.getDate()}</span>
                  {ws.length > 0 && (
                    <div className="flex gap-0.5">
                      {ws.slice(0, 3).map((w) => (
                        <span
                          key={w.id}
                          className="h-1 w-1 rounded-full"
                          style={{
                            background: isSel
                              ? "currentColor"
                              : completed
                                ? "var(--primary)"
                                : "var(--muted-foreground)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="soft-card p-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {new Date(selected).toLocaleDateString("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h3 className="text-xl font-semibold tracking-tight mt-1">
            {selectedWorkouts.length} session{selectedWorkouts.length === 1 ? "" : "s"}
          </h3>

          {selectedStat && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Cal" v={selectedStat.caloriesBurned} />
              <Stat label="Min" v={selectedStat.workoutMinutes} />
              <Stat label="Sleep" v={`${selectedStat.sleep}h`} />
            </div>
          )}

          <div className="mt-5 space-y-2">
            {selectedWorkouts.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nothing scheduled. Rest is training too.
              </p>
            )}
            {selectedWorkouts.map((w) => {
              const meta = CATEGORY_META[w.category];
              const Icon = meta.icon;
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border"
                >
                  <div
                    className="h-9 w-9 rounded-xl grid place-items-center"
                    style={{ background: meta.tint }}
                  >
                    <Icon className="h-4 w-4" style={{ color: meta.ring }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{w.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {w.duration} min · {w.calories} kcal
                    </div>
                  </div>
                  <span
                    className={`h-2 w-2 rounded-full ${w.completed ? "bg-primary" : "bg-muted-foreground/40"}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: number | string }) {
  return (
    <div className="rounded-xl bg-surface-elevated border border-border py-2.5">
      <div className="text-sm font-semibold tabular-nums">{v}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

function buildMonth(cursor: Date): (Date | null)[] {
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0).getDate();
  const startPad = first.getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
