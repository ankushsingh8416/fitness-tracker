import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Wellness } from "@/components/health/Wellness";

export const Route = createFileRoute("/wellness")({
  head: () => ({ meta: [{ title: "Wellness — Pulse" }, { name: "description", content: "Recovery, breathing, and mindfulness." }] }),
  component: () => (<AppShell><Wellness /></AppShell>),
});
