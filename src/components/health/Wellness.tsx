import { useEffect, useRef, useState } from "react";
import { actions, todayISO, useStore } from "@/store";
import {
  Droplets,
  Moon,
  HeartPulse,
  Wind,
  Plus,
  Minus,
  Quote,
  Sparkles,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressRing } from "@/components/ui-extra/ProgressRing";

export function Wellness() {
  const today = useStore((s) => s.stats[0]);
  const goals = useStore((s) => s.goals);

  const water = today?.water ?? 0;
  const sleep = today?.sleep ?? 0;
  const score = Math.round(
    (Math.min(100, (water / goals.water) * 100) +
      Math.min(100, (sleep / goals.sleep) * 100) +
      Math.min(100, ((today?.workoutMinutes ?? 0) / goals.workoutMinutes) * 100)) /
      3,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Wellness</h1>
        <p className="text-muted-foreground mt-1">
          Recovery is where progress is made.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="soft-card p-6 lg:col-span-2 flex flex-col md:flex-row items-center gap-6">
          <ProgressRing value={score} size={160} stroke={12} label={`${score}`} sublabel="Health score" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight">You're in great shape.</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Based on hydration, sleep, and activity over the last 24 hours. Small consistent
              steps yield the most durable results.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill label={`${water}/${goals.water} glasses`} />
              <Pill label={`${sleep}h sleep`} />
              <Pill label={`${today?.workoutMinutes ?? 0} active min`} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="soft-card p-6 bg-gradient-to-br from-surface to-accent/30 flex flex-col justify-between">
          <Quote className="h-5 w-5 text-primary" />
          <div className="mt-3">
            <p className="text-base font-medium leading-snug text-balance">
              "Take care of your body. It's the only place you have to live."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Jim Rohn</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <WaterCard />
        <SleepCard />
        <MoodCard />
        <BreathingCard />
        <MeditationTimer />
        <HeartRateCard />
      </div>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
      {label}
    </span>
  );
}

function WaterCard() {
  const today = useStore((s) => s.stats[0]);
  const goal = useStore((s) => s.goals.water);
  const water = today?.water ?? 0;
  const set = (n: number) =>
    actions.updateDailyStat(todayISO(), { water: Math.max(0, n) });
  return (
    <div className="soft-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "oklch(0.72 0.14 225 / 0.14)" }}>
          <Droplets className="h-4 w-4" style={{ color: "oklch(0.72 0.14 225)" }} />
        </div>
        <span className="text-sm font-medium">Hydration</span>
      </div>
      <div className="text-3xl font-semibold tabular-nums">
        {water}
        <span className="text-sm text-muted-foreground font-normal"> / {goal} glasses</span>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: goal }).map((_, i) => (
          <button
            key={i}
            onClick={() => set(i + 1 === water ? i : i + 1)}
            className="h-9 flex-1 rounded-lg transition-all"
            style={{
              background:
                i < water ? "oklch(0.72 0.14 225)" : "var(--secondary)",
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-1.5">
        <button onClick={() => set(water - 1)} className="h-9 w-9 grid place-items-center rounded-xl border border-border hover:bg-secondary">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => set(water + 1)} className="h-9 flex-1 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add glass
        </button>
      </div>
    </div>
  );
}

function SleepCard() {
  const today = useStore((s) => s.stats[0]);
  const sleep = today?.sleep ?? 0;
  return (
    <div className="soft-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "oklch(0.7 0.16 305 / 0.14)" }}>
          <Moon className="h-4 w-4" style={{ color: "oklch(0.7 0.16 305)" }} />
        </div>
        <span className="text-sm font-medium">Sleep</span>
      </div>
      <div className="text-3xl font-semibold tabular-nums">
        {sleep}
        <span className="text-sm text-muted-foreground font-normal"> hours</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Last night</p>
      <input
        type="range"
        min={0}
        max={12}
        step={0.5}
        value={sleep}
        onChange={(e) => actions.updateDailyStat(todayISO(), { sleep: +e.target.value })}
        className="w-full mt-4 accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
      </div>
    </div>
  );
}

function MoodCard() {
  const today = useStore((s) => s.stats[0]);
  const mood = today?.mood ?? 3;
  const moods = [
    { v: 1, icon: Frown, label: "Low" },
    { v: 2, icon: Frown, label: "Meh" },
    { v: 3, icon: Meh, label: "Okay" },
    { v: 4, icon: Smile, label: "Good" },
    { v: 5, icon: Smile, label: "Great" },
  ] as const;
  return (
    <div className="soft-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "oklch(0.78 0.16 50 / 0.16)" }}>
          <Sparkles className="h-4 w-4" style={{ color: "oklch(0.78 0.16 50)" }} />
        </div>
        <span className="text-sm font-medium">Mood today</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">How are you feeling?</p>
      <div className="grid grid-cols-5 gap-1.5">
        {moods.map((m) => {
          const Icon = m.icon;
          const active = mood === m.v;
          return (
            <button
              key={m.v}
              onClick={() => actions.updateDailyStat(todayISO(), { mood: m.v })}
              className={`aspect-square rounded-xl grid place-items-center transition-all ${active ? "bg-primary text-primary-foreground scale-105" : "bg-surface-elevated border border-border hover:bg-secondary"}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-muted-foreground text-center">
        {moods.find((m) => m.v === mood)?.label}
      </div>
    </div>
  );
}

function BreathingCard() {
  const [running, setRunning] = useState(false);
  return (
    <div className="soft-card p-5 flex flex-col">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "oklch(0.85 0.17 150 / 0.14)" }}>
          <Wind className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium">Box breathing</span>
      </div>
      <p className="text-xs text-muted-foreground">4 · 4 · 4 · 4 — reset your nervous system.</p>

      <div className="grid place-items-center my-6">
        <motion.div
          animate={
            running
              ? { scale: [1, 1.4, 1.4, 1, 1], opacity: [0.6, 1, 1, 0.6, 0.6] }
              : { scale: 1, opacity: 0.6 }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="h-28 w-28 rounded-full bg-primary/30 grid place-items-center"
        >
          <div className="h-20 w-20 rounded-full bg-primary/60 grid place-items-center text-primary-foreground text-xs font-medium">
            {running ? "Breathe" : "Ready"}
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => setRunning((r) => !r)}
        className="h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
      >
        {running ? "Stop" : "Begin"}
      </button>
    </div>
  );
}

function MeditationTimer() {
  const [time, setTime] = useState(300); // 5 min
  const [left, setLeft] = useState(time);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  useEffect(() => setLeft(time), [time]);

  const mm = Math.floor(left / 60);
  const ss = left % 60;
  const pct = ((time - left) / time) * 100;

  return (
    <div className="soft-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "oklch(0.7 0.1 280 / 0.14)" }}>
          <Sparkles className="h-4 w-4" style={{ color: "oklch(0.7 0.1 280)" }} />
        </div>
        <span className="text-sm font-medium">Meditation</span>
      </div>
      <div className="grid place-items-center my-4">
        <ProgressRing
          value={pct}
          size={130}
          stroke={10}
          color="oklch(0.7 0.1 280)"
          label={`${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}
          sublabel="Focus"
        />
      </div>
      <div className="flex gap-1.5 mb-3">
        {[180, 300, 600, 900].map((t) => (
          <button
            key={t}
            onClick={() => {
              setRunning(false);
              setTime(t);
            }}
            className={`flex-1 h-8 rounded-lg text-xs font-medium border transition-colors ${time === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {t / 60}m
          </button>
        ))}
      </div>
      <button
        onClick={() => setRunning((r) => !r)}
        className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
      >
        {running ? "Pause" : left === 0 ? "Restart" : "Start"}
      </button>
    </div>
  );
}

function HeartRateCard() {
  const today = useStore((s) => s.stats[0]);
  return (
    <div className="soft-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "oklch(0.72 0.17 25 / 0.14)" }}>
          <HeartPulse className="h-4 w-4" style={{ color: "oklch(0.72 0.17 25)" }} />
        </div>
        <span className="text-sm font-medium">Resting heart rate</span>
      </div>
      <div className="text-4xl font-semibold tabular-nums">
        {today?.heartRate ?? 62}
        <span className="text-sm text-muted-foreground font-normal ml-1">bpm</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Updated this morning</p>
      <AnimatePresence>
        <motion.div
          className="mt-5 flex items-center gap-1 h-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 0.6)) * 80;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-full bg-destructive/70"
                style={{ height: `${h}%` }}
                animate={{ scaleY: [1, 0.6, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.06 }}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
