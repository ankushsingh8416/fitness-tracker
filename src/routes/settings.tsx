import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Settings } from "@/components/settings/Settings";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Pulse" }, { name: "description", content: "Profile and reminders." }] }),
  component: () => (<AppShell><Settings /></AppShell>),
});
