import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Analytics } from "@/components/analytics/Analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — FIT-HO" }, { name: "description", content: "Insights from your training and recovery." }] }),
  component: () => (<AppShell><Analytics /></AppShell>),
});
