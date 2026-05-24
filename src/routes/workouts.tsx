import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Workouts } from "@/components/workouts/Workouts";

export const Route = createFileRoute("/workouts")({
  head: () => ({ meta: [{ title: "Workouts — Pulse" }, { name: "description", content: "Plan and track your workouts." }] }),
  component: () => (<AppShell><Workouts /></AppShell>),
});
