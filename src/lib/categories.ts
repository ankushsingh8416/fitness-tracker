import type { WorkoutCategory } from "@/types";
import {
  Dumbbell,
  HeartPulse,
  Flower2,
  Flame,
  Footprints,
  Bike,
  Home,
  Brain,
  StretchHorizontal,
} from "lucide-react";

export const CATEGORY_META: Record<
  WorkoutCategory,
  { icon: typeof Dumbbell; tint: string; ring: string }
> = {
  Strength: { icon: Dumbbell, tint: "oklch(0.85 0.17 150 / 0.14)", ring: "oklch(0.85 0.17 150)" },
  Cardio: { icon: HeartPulse, tint: "oklch(0.72 0.17 25 / 0.14)", ring: "oklch(0.72 0.17 25)" },
  Yoga: { icon: Flower2, tint: "oklch(0.7 0.16 305 / 0.14)", ring: "oklch(0.7 0.16 305)" },
  HIIT: { icon: Flame, tint: "oklch(0.78 0.16 50 / 0.16)", ring: "oklch(0.78 0.16 50)" },
  Running: { icon: Footprints, tint: "oklch(0.72 0.14 225 / 0.14)", ring: "oklch(0.72 0.14 225)" },
  Cycling: { icon: Bike, tint: "oklch(0.78 0.13 200 / 0.14)", ring: "oklch(0.78 0.13 200)" },
  Home: { icon: Home, tint: "oklch(0.78 0.1 95 / 0.16)", ring: "oklch(0.78 0.1 95)" },
  Meditation: { icon: Brain, tint: "oklch(0.7 0.1 280 / 0.14)", ring: "oklch(0.7 0.1 280)" },
  Stretching: { icon: StretchHorizontal, tint: "oklch(0.78 0.11 165 / 0.14)", ring: "oklch(0.78 0.11 165)" },
};

export const CATEGORIES: WorkoutCategory[] = [
  "Strength",
  "Cardio",
  "Yoga",
  "HIIT",
  "Running",
  "Cycling",
  "Home",
  "Meditation",
  "Stretching",
];
