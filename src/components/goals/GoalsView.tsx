import { actions, useStore } from "@/store";
import { ProgressRing } from "@/components/ui-extra/ProgressRing";
import {
  Footprints,
  Droplets,
  Moon,
  Timer,
  Flame,
  Scale,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Goals } from "@/types";

const META = [
  { key: "steps" as const, label: "Daily steps", icon: Footprints, unit: "steps", accent: "oklch(0.72 0.14 225)" },
  { key: "water" as const, label: "Water intake", icon: Droplets, unit: "glasses", accent: "oklch(0.7 0.15 220)" },
  { key: "sleep" as const, label: "Sleep target", icon: Moon, unit: "hours", accent: "oklch(0.7 0.16 305)" },
  { key: "workoutMinutes" as const, label: "Workout time", icon: Timer, unit: "min", accent: "var(--primary)" },
  { key: "calories" as const, label: "Calories burned", icon: Flame, unit: "kcal", accent: "oklch(0.72 0.17 25)" },
  { key: "weight" as const, label: "Weight goal", icon: Scale, unit: "kg", accent: "oklch(0.78 0.1 95)" },
];

export function GoalsView() {
  const goals = useStore((s) => s.goals);
  const today = useStore((s) => s.stats[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1">
            Define what matters. Adjust anytime.
          </p>
        </div>
        <div className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-primary" />
          {achieved(goals, today)} of {META.length} met today
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {META.map((m, i) => {
          const Icon = m.icon;
          const goal = goals[m.key];
          const current =
            m.key === "weight"
              ? (today?.weight ?? goal)
              : (today?.[mapStat(m.key)] as number) ?? 0;
          const pct =
            m.key === "weight"
              ? Math.min(100, Math.round((goal / (current || goal)) * 100))
              : Math.min(100, Math.round((current / goal) * 100));
          const met = pct >= 100;
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="soft-card p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-9 w-9 rounded-xl grid place-items-center"
                    style={{ background: `color-mix(in oklab, ${m.accent} 14%, transparent)` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: m.accent }} />
                  </div>
                  <span className="text-sm font-medium">{m.label}</span>
                </div>
                {met && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/15 text-primary">
                    Achieved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-5 mt-3">
                <ProgressRing value={pct} size={108} stroke={9} color={m.accent} />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Current</div>
                  <div className="text-2xl font-semibold tabular-nums">
                    {fmt(current)}{" "}
                    <span className="text-sm text-muted-foreground font-normal">{m.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Target</div>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={goal}
                      onChange={(e) =>
                        actions.setGoals({ [m.key]: +e.target.value } as Partial<Goals>)
                      }
                      className="input flex-1"
                    />
                    <span className="text-xs text-muted-foreground">{m.unit}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function mapStat(k: keyof Goals) {
  if (k === "workoutMinutes") return "workoutMinutes" as const;
  if (k === "calories") return "caloriesBurned" as const;
  return k as "steps" | "water" | "sleep";
}
function fmt(n: number) {
  if (n >= 1000) return n.toLocaleString();
  return n;
}
function achieved(goals: Goals, today?: { steps?: number; water?: number; sleep?: number; workoutMinutes?: number; caloriesBurned?: number; weight?: number }) {
  if (!today) return 0;
  let n = 0;
  if ((today.steps ?? 0) >= goals.steps) n++;
  if ((today.water ?? 0) >= goals.water) n++;
  if ((today.sleep ?? 0) >= goals.sleep) n++;
  if ((today.workoutMinutes ?? 0) >= goals.workoutMinutes) n++;
  if ((today.caloriesBurned ?? 0) >= goals.calories) n++;
  if ((today.weight ?? 99) <= goals.weight) n++;
  return n;
}
