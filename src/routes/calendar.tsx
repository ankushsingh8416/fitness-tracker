import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CalendarView } from "@/components/calendar/CalendarView";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Pulse" }, { name: "description", content: "Your training rhythm across the month." }] }),
  component: () => (<AppShell><CalendarView /></AppShell>),
});
