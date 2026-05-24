import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { GoalsView } from "@/components/goals/GoalsView";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goals — FIT-HO" }, { name: "description", content: "Set and track your wellness goals." }] }),
  component: () => (<AppShell><GoalsView /></AppShell>),
});
