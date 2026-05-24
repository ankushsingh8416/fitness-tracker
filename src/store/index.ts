import { useSyncExternalStore } from "react";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type {
  DailyStats,
  Goals,
  Reminder,
  UserProfile,
  Workout,
} from "@/types";

type Listener = () => void;

interface State {
  workouts: Workout[];
  stats: DailyStats[];
  goals: Goals;
  reminders: Reminder[];
  profile: UserProfile;
  theme: "light" | "dark" | "system";
}

const KEY = "fitwell.v1";

const DEFAULT_STATE: State = {
  workouts: seedWorkouts(),
  stats: seedStats(),
  goals: {
    steps: 10000,
    water: 8,
    sleep: 8,
    workoutMinutes: 45,
    calories: 600,
    weight: 70,
  },
  reminders: [
    { id: "r1", type: "water", label: "Hydrate", time: "10:00", enabled: true, days: [1,2,3,4,5] },
    { id: "r2", type: "workout", label: "Evening workout", time: "18:30", enabled: true, days: [1,3,5] },
    { id: "r3", type: "sleep", label: "Wind down", time: "22:30", enabled: true, days: [0,1,2,3,4,5,6] },
  ],
  profile: { name: "Alex Morgan", heightCm: 178, weightKg: 72, age: 28, avatarColor: "#A7F3C2" },
  theme: "dark",
};

let state: State = DEFAULT_STATE;
let initialized = false;
const listeners = new Set<Listener>();

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const stored = getFromStorage<Partial<State> | null>(KEY, null);
  if (stored) state = { ...DEFAULT_STATE, ...stored };
  applyTheme(state.theme);
}

function emit() {
  saveToStorage(KEY, state);
  listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
  init();
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  init();
  return state;
}
const serverSnap = DEFAULT_STATE;
function getServerSnapshot() {
  return serverSnap;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot()),
  );
}

// ---------- Mutations ----------
export const actions = {
  addWorkout(w: Omit<Workout, "id" | "createdAt">) {
    const workout: Workout = {
      ...w,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    state = { ...state, workouts: [workout, ...state.workouts] };
    emit();
  },
  updateWorkout(id: string, patch: Partial<Workout>) {
    state = {
      ...state,
      workouts: state.workouts.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    };
    emit();
  },
  deleteWorkout(id: string) {
    state = { ...state, workouts: state.workouts.filter((w) => w.id !== id) };
    emit();
  },
  toggleWorkoutComplete(id: string) {
    state = {
      ...state,
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, completed: !w.completed } : w,
      ),
    };
    // also bump today's stats
    if (state.workouts.find((w) => w.id === id)?.completed) {
      const w = state.workouts.find((x) => x.id === id)!;
      const today = todayISO();
      const existing = state.stats.find((s) => s.date === today);
      if (existing) {
        actions.updateDailyStat(today, {
          workoutMinutes: existing.workoutMinutes + w.duration,
          caloriesBurned: existing.caloriesBurned + w.calories,
        });
        return;
      }
    }
    emit();
  },
  updateDailyStat(date: string, patch: Partial<DailyStats>) {
    const existing = state.stats.find((s) => s.date === date);
    if (existing) {
      state = {
        ...state,
        stats: state.stats.map((s) => (s.date === date ? { ...s, ...patch } : s)),
      };
    } else {
      const base: DailyStats = {
        date,
        steps: 0,
        caloriesBurned: 0,
        water: 0,
        sleep: 0,
        workoutMinutes: 0,
      };
      state = { ...state, stats: [{ ...base, ...patch }, ...state.stats] };
    }
    emit();
  },
  setGoals(goals: Partial<Goals>) {
    state = { ...state, goals: { ...state.goals, ...goals } };
    emit();
  },
  setProfile(profile: Partial<UserProfile>) {
    state = { ...state, profile: { ...state.profile, ...profile } };
    emit();
  },
  setTheme(theme: State["theme"]) {
    state = { ...state, theme };
    applyTheme(theme);
    emit();
  },
  addReminder(r: Omit<Reminder, "id">) {
    state = { ...state, reminders: [...state.reminders, { ...r, id: crypto.randomUUID() }] };
    emit();
  },
  toggleReminder(id: string) {
    state = {
      ...state,
      reminders: state.reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    };
    emit();
  },
  deleteReminder(id: string) {
    state = { ...state, reminders: state.reminders.filter((r) => r.id !== id) };
    emit();
  },
};

export function applyTheme(theme: State["theme"]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- Seed (so first paint is gorgeous) ----------
function seedWorkouts(): Workout[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const ago = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return iso(d);
  };
  return [
    {
      id: "w1",
      title: "Upper Body Power",
      category: "Strength",
      duration: 55,
      calories: 420,
      difficulty: "Hard",
      targetMuscles: "Chest, Shoulders, Triceps",
      notes: "Increase bench by 2.5kg next session.",
      exercises: [
        { id: "e1", name: "Bench Press", sets: 4, reps: 8 },
        { id: "e2", name: "Overhead Press", sets: 4, reps: 6 },
        { id: "e3", name: "Pull-ups", sets: 3, reps: 10 },
      ],
      completed: true,
      date: ago(0),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w2",
      title: "Morning 5K",
      category: "Running",
      duration: 28,
      calories: 310,
      difficulty: "Moderate",
      exercises: [{ id: "e4", name: "Outdoor Run", duration: 28 }],
      completed: true,
      date: ago(1),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w3",
      title: "Mobility & Flow",
      category: "Yoga",
      duration: 35,
      calories: 140,
      difficulty: "Easy",
      exercises: [{ id: "e5", name: "Vinyasa Flow", duration: 35 }],
      completed: false,
      date: ago(0),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w4",
      title: "HIIT Burner",
      category: "HIIT",
      duration: 22,
      calories: 380,
      difficulty: "Hard",
      exercises: [{ id: "e6", name: "Tabata Circuit", duration: 22 }],
      completed: true,
      date: ago(2),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w5",
      title: "Lower Body Strength",
      category: "Strength",
      duration: 60,
      calories: 470,
      difficulty: "Hard",
      targetMuscles: "Quads, Glutes, Hamstrings",
      exercises: [
        { id: "e7", name: "Back Squat", sets: 5, reps: 5 },
        { id: "e8", name: "Romanian Deadlift", sets: 4, reps: 8 },
      ],
      completed: true,
      date: ago(3),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w6",
      title: "Cycle Recovery",
      category: "Cycling",
      duration: 45,
      calories: 290,
      difficulty: "Easy",
      exercises: [{ id: "e9", name: "Zone 2 Ride", duration: 45 }],
      completed: true,
      date: ago(4),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w7",
      title: "Evening Stretch",
      category: "Stretching",
      duration: 15,
      calories: 50,
      difficulty: "Easy",
      exercises: [{ id: "e10", name: "Full Body Stretch", duration: 15 }],
      completed: false,
      date: ago(0),
      createdAt: new Date().toISOString(),
    },
    {
      id: "w8",
      title: "Mindful Reset",
      category: "Meditation",
      duration: 12,
      calories: 10,
      difficulty: "Easy",
      exercises: [{ id: "e11", name: "Guided Breath", duration: 12 }],
      completed: true,
      date: ago(1),
      createdAt: new Date().toISOString(),
    },
  ];
  
}

function seedStats(): DailyStats[] {
  const out: DailyStats[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const wave = Math.sin(i / 3) * 0.5 + 0.5;
    out.push({
      date: iso,
      steps: Math.round(6500 + wave * 5500 + Math.random() * 1500),
      caloriesBurned: Math.round(380 + wave * 350 + Math.random() * 120),
      water: Math.max(3, Math.round(5 + wave * 4)),
      sleep: +(6.4 + wave * 1.8 + Math.random() * 0.4).toFixed(1),
      workoutMinutes: Math.round(20 + wave * 60),
      heartRate: Math.round(62 + Math.random() * 14),
      weight: +(72 - i * 0.04 + (Math.random() - 0.5) * 0.3).toFixed(1),
    });
  }
  return out;
}
