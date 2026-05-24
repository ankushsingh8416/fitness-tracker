import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { actions, todayISO, useStore } from "@/store";
import { CATEGORIES, CATEGORY_META } from "@/lib/categories";
import type { Difficulty, Workout, WorkoutCategory } from "@/types";
import { Plus, Check, Trash2, Pencil, X, Clock, Flame, Search } from "lucide-react";

const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Hard"];

export function Workouts() {
  const workouts = useStore((s) => s.workouts);
  const [cat, setCat] = useState<WorkoutCategory | "All">("All");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Workout | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return workouts.filter(
      (w) =>
        (cat === "All" || w.category === cat) &&
        (q === "" || w.title.toLowerCase().includes(q.toLowerCase())),
    );
  }, [workouts, cat, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground mt-1">Plan, log, and track every session.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 ring-glow"
        >
          <Plus className="h-4 w-4" /> New workout
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search workouts"
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface border border-border text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(["All", ...CATEGORIES] as const).map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`h-10 px-4 rounded-xl text-xs font-medium whitespace-nowrap border transition-colors ${active ? "bg-foreground text-background border-foreground" : "bg-surface border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState onCreate={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((w, i) => (
            <WorkoutCard
              key={w.id}
              w={w}
              i={i}
              onEdit={() => {
                setEditing(w);
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <WorkoutModal
            initial={editing}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkoutCard({ w, i, onEdit }: { w: Workout; i: number; onEdit: () => void }) {
  const meta = CATEGORY_META[w.category];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className="soft-card p-5 hover:border-foreground/15 transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-11 w-11 rounded-2xl grid place-items-center"
          style={{ background: meta.tint }}
        >
          <Icon className="h-5 w-5" style={{ color: meta.ring }} />
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
            w.completed
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {w.completed ? "Completed" : "Planned"}
        </span>
      </div>
      <h3 className="text-base font-semibold tracking-tight">{w.title}</h3>
      <div className="mt-1 text-xs text-muted-foreground">
        {w.category} · {w.difficulty}
        {w.targetMuscles && ` · ${w.targetMuscles}`}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {w.duration} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          {w.calories} kcal
        </span>
        <span className="ml-auto tabular-nums">
          {new Date(w.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
        </span>
      </div>

      {w.exercises.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-1.5">
          {w.exercises.slice(0, 3).map((e) => (
            <div key={e.id} className="flex items-center justify-between text-xs">
              <span className="text-foreground/80">{e.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {e.sets && e.reps ? `${e.sets}×${e.reps}` : e.duration ? `${e.duration} min` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5">
        <button
          onClick={() => actions.toggleWorkoutComplete(w.id)}
          className={`flex-1 h-9 rounded-xl text-xs font-medium border transition-colors inline-flex items-center justify-center gap-1.5 ${w.completed ? "border-border text-muted-foreground hover:bg-secondary" : "border-primary bg-primary text-primary-foreground hover:opacity-90"}`}
        >
          <Check className="h-3.5 w-3.5" /> {w.completed ? "Undo" : "Complete"}
        </button>
        <button
          onClick={onEdit}
          className="h-9 w-9 grid place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => actions.deleteWorkout(w.id)}
          className="h-9 w-9 grid place-items-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="soft-card p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-accent grid place-items-center mb-4">
        <Plus className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">Build your first workout</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        Create a routine with exercises, sets, and reps. Track sessions and watch progress
        compound.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> New workout
      </button>
    </div>
  );
}

function WorkoutModal({
  initial,
  onClose,
}: {
  initial: Workout | null;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<WorkoutCategory>(initial?.category ?? "Strength");
  const [duration, setDuration] = useState(initial?.duration ?? 45);
  const [calories, setCalories] = useState(initial?.calories ?? 300);
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "Moderate");
  const [targetMuscles, setTargetMuscles] = useState(initial?.targetMuscles ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [exercises, setExercises] = useState(
    initial?.exercises ?? [{ id: crypto.randomUUID(), name: "", sets: 3, reps: 10 }],
  );
  const [date, setDate] = useState(initial?.date ?? todayISO());

  const save = () => {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      category,
      duration: Number(duration) || 0,
      calories: Number(calories) || 0,
      difficulty,
      targetMuscles: targetMuscles.trim() || undefined,
      notes: notes.trim() || undefined,
      exercises: exercises.filter((e) => e.name.trim()),
      completed: initial?.completed ?? false,
      date,
    };
    if (initial) actions.updateWorkout(initial.id, payload);
    else actions.addWorkout(payload);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm grid place-items-end sm:place-items-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="bg-popover w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {initial ? "Edit workout" : "New workout"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              All data is saved locally on your device.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-xl hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Workout title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Upper Body Power"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkoutCategory)}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="input"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Duration (min)">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Calories">
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(+e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Target muscles">
            <input
              value={targetMuscles}
              onChange={(e) => setTargetMuscles(e.target.value)}
              placeholder="Chest, Shoulders, Triceps"
              className="input"
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Exercises
              </span>
              <button
                onClick={() =>
                  setExercises((ex) => [
                    ...ex,
                    { id: crypto.randomUUID(), name: "", sets: 3, reps: 10 },
                  ])
                }
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="grid grid-cols-[1fr_70px_70px_auto] gap-2 items-center"
                >
                  <input
                    value={ex.name}
                    onChange={(e) =>
                      setExercises((arr) =>
                        arr.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)),
                      )
                    }
                    placeholder="Exercise name"
                    className="input"
                  />
                  <input
                    type="number"
                    value={ex.sets ?? ""}
                    onChange={(e) =>
                      setExercises((arr) =>
                        arr.map((x, idx) => (idx === i ? { ...x, sets: +e.target.value } : x)),
                      )
                    }
                    placeholder="Sets"
                    className="input text-center"
                  />
                  <input
                    type="number"
                    value={ex.reps ?? ""}
                    onChange={(e) =>
                      setExercises((arr) =>
                        arr.map((x, idx) => (idx === i ? { ...x, reps: +e.target.value } : x)),
                      )
                    }
                    placeholder="Reps"
                    className="input text-center"
                  />
                  <button
                    onClick={() => setExercises((arr) => arr.filter((_, idx) => idx !== i))}
                    className="h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="How did it feel? What to improve?"
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-border hover:bg-secondary text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            {initial ? "Save changes" : "Create workout"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
