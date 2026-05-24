export type WorkoutCategory =
  | "Strength"
  | "Cardio"
  | "Yoga"
  | "HIIT"
  | "Running"
  | "Cycling"
  | "Home"
  | "Meditation"
  | "Stretching";

export type Difficulty = "Easy" | "Moderate" | "Hard";

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // minutes
}

export interface Workout {
  id: string;
  title: string;
  category: WorkoutCategory;
  duration: number; // minutes
  calories: number;
  difficulty: Difficulty;
  targetMuscles?: string;
  notes?: string;
  exercises: Exercise[];
  completed: boolean;
  date: string; // ISO date (yyyy-mm-dd)
  createdAt: string;
}

export interface DailyStats {
  date: string; // yyyy-mm-dd
  steps: number;
  caloriesBurned: number;
  water: number; // glasses (250ml)
  sleep: number; // hours
  workoutMinutes: number;
  heartRate?: number; // bpm
  weight?: number; // kg
  mood?: 1 | 2 | 3 | 4 | 5;
}

export interface Goals {
  steps: number;
  water: number;
  sleep: number;
  workoutMinutes: number;
  calories: number;
  weight: number;
}

export interface Reminder {
  id: string;
  type: "workout" | "water" | "sleep" | "custom";
  label: string;
  time: string; // HH:mm
  enabled: boolean;
  days: number[]; // 0-6
}

export interface UserProfile {
  name: string;
  heightCm: number;
  weightKg: number;
  age: number;
  avatarColor: string;
}
