import { useStore } from "@/store";
import { StatCard } from "@/components/ui-extra/StatCard";
import { ProgressRing } from "@/components/ui-extra/ProgressRing";
import {
  Flame,
  Footprints,
  Droplets,
  Moon,
  HeartPulse,
  Timer,
  Scale,
  Quote,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CATEGORY_META } from "@/lib/categories";

export function Dashboard() {
  const stats = useStore((s) => s.stats);
  const goals = useStore((s) => s.goals);
  const workouts = useStore((s) => s.workouts);
  const profile = useStore((s) => s.profile);

  const today = stats[0] ?? {
    steps: 0,
    caloriesBurned: 0,
    water: 0,
    sleep: 0,
    workoutMinutes: 0,
    heartRate: 0,
    weight: profile.weightKg,
  };
  const bmi = +(profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1);

  const week = [...stats.slice(0, 7)].reverse().map((s) => ({
    day: new Date(s.date).toLocaleDateString("en", { weekday: "short" }),
    cal: s.caloriesBurned,
  }));

  const upcoming = workouts.filter((w) => !w.completed).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">
            Good {greet()}, {profile.name.split(" ")[0]}.
          </h1>
          <p className="text-muted-foreground mt-2 text-balance max-w-xl">
            You're {percent(today.workoutMinutes, goals.workoutMinutes)}% toward your daily move
            goal. A small effort today compounds tomorrow.
          </p>
        </div>
        <Link
          to="/workouts"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 ring-glow transition-opacity"
        >
          <Plus className="h-4 w-4" /> Log workout
        </Link>
      </div>

      {/* Top: Activity rings + quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="soft-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Today's activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Move · Hydrate · Rest</p>
            </div>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> +12% vs. yesterday
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <ProgressRing
                value={percent(today.workoutMinutes, goals.workoutMinutes)}
                label={`${today.workoutMinutes}'`}
                sublabel="Move"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Goal {goals.workoutMinutes} min
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing
                value={percent(today.water, goals.water)}
                label={`${today.water}/${goals.water}`}
                sublabel="Water"
                color="oklch(0.72 0.14 225)"
              />
              <p className="text-xs text-muted-foreground mt-2">Glasses</p>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing
                value={percent(today.sleep, goals.sleep)}
                label={`${today.sleep}h`}
                sublabel="Sleep"
                color="oklch(0.7 0.16 305)"
              />
              <p className="text-xs text-muted-foreground mt-2">Goal {goals.sleep}h</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="soft-card p-6 flex flex-col justify-between bg-gradient-to-br from-surface to-accent/20"
        >
          <Quote className="h-5 w-5 text-primary" />
          <div className="mt-4">
            <p className="text-lg font-medium leading-snug tracking-tight text-balance">
              "Discipline is choosing between what you want now and what you want most."
            </p>
            <p className="text-xs text-muted-foreground mt-3">Daily focus · {greet()}</p>
          </div>
        </motion.div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          label="Calories"
          value={today.caloriesBurned}
          unit="kcal"
          trend="+8%"
          trendUp
          accent="oklch(0.72 0.17 25)"
          delay={0}
        />
        <StatCard
          icon={Footprints}
          label="Steps"
          value={today.steps.toLocaleString()}
          trend={`${percent(today.steps, goals.steps)}%`}
          trendUp
          accent="oklch(0.72 0.14 225)"
          delay={0.05}
        />
        <StatCard
          icon={Droplets}
          label="Water"
          value={today.water}
          unit={`/ ${goals.water} glasses`}
          accent="oklch(0.7 0.15 220)"
          delay={0.1}
        />
        <StatCard
          icon={Moon}
          label="Sleep"
          value={today.sleep}
          unit="hours"
          trend="+0.4h"
          trendUp
          accent="oklch(0.7 0.16 305)"
          delay={0.15}
        />
        <StatCard
          icon={Timer}
          label="Workout"
          value={today.workoutMinutes}
          unit="min"
          accent="var(--primary)"
          delay={0.2}
        />
        <StatCard
          icon={HeartPulse}
          label="Resting HR"
          value={today.heartRate ?? 62}
          unit="bpm"
          accent="oklch(0.72 0.17 25)"
          delay={0.25}
        />
        <StatCard
          icon={Scale}
          label="Weight"
          value={today.weight ?? profile.weightKg}
          unit="kg"
          trend="-0.6kg"
          trendUp
          accent="oklch(0.78 0.1 95)"
          delay={0.3}
        />
        <StatCard
          icon={TrendingUp}
          label="BMI"
          value={bmi}
          unit={bmiLabel(bmi)}
          accent="oklch(0.78 0.13 150)"
          delay={0.35}
        />
      </div>

      {/* Calories chart + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="soft-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Calories burned</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">
              {week.reduce((a, b) => a + b.cal, 0).toLocaleString()}
              <span className="text-sm text-muted-foreground font-normal ml-1">kcal</span>
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={week} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-cal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cal"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#grad-cal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="soft-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold tracking-tight">Up next</h3>
            <Link to="/workouts" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                You're all caught up today.
              </p>
            )}
            {upcoming.map((w) => {
              const meta = CATEGORY_META[w.category];
              const Icon = meta.icon;
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border hover:border-foreground/15 transition-colors"
                >
                  <div
                    className="h-10 w-10 rounded-xl grid place-items-center"
                    style={{ background: meta.tint }}
                  >
                    <Icon className="h-4 w-4" style={{ color: meta.ring }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{w.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {w.duration} min · {w.calories} kcal · {w.difficulty}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function percent(v: number, goal: number) {
  if (!goal) return 0;
  return Math.min(100, Math.round((v / goal) * 100));
}
function greet() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
function bmiLabel(b: number) {
  if (b < 18.5) return "Low";
  if (b < 25) return "Healthy";
  if (b < 30) return "High";
  return "Very high";
}
