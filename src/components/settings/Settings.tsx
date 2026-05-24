import { actions, useStore } from "@/store";
import { Bell, Clock, Plus, Trash2, User } from "lucide-react";
import { useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Settings() {
  const profile = useStore((s) => s.profile);
  const reminders = useStore((s) => s.reminders);
  const theme = useStore((s) => s.theme);

  const [label, setLabel] = useState("");
  const [time, setTime] = useState("08:00");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize your experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="soft-card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <User className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">Profile</h2>
          </div>
          <div className="space-y-4">
            <Row label="Name">
              <input
                value={profile.name}
                onChange={(e) => actions.setProfile({ name: e.target.value })}
                className="input"
              />
            </Row>
            <div className="grid grid-cols-3 gap-3">
              <Row label="Age">
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => actions.setProfile({ age: +e.target.value })}
                  className="input"
                />
              </Row>
              <Row label="Height (cm)">
                <input
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) => actions.setProfile({ heightCm: +e.target.value })}
                  className="input"
                />
              </Row>
              <Row label="Weight (kg)">
                <input
                  type="number"
                  value={profile.weightKg}
                  onChange={(e) => actions.setProfile({ weightKg: +e.target.value })}
                  className="input"
                />
              </Row>
            </div>
            <Row label="Theme">
              <div className="inline-flex rounded-xl border border-border p-0.5">
                {(["light", "system", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => actions.setTheme(t)}
                    className={`h-9 px-4 rounded-lg text-xs font-medium capitalize ${theme === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Row>
          </div>
        </section>

        <section className="soft-card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">Reminders</h2>
          </div>
          <div className="space-y-2">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border"
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{r.label}</div>
                  <div className="text-xs text-muted-foreground inline-flex gap-1 items-center mt-0.5">
                    <span className="tabular-nums">{r.time}</span>
                    <span>·</span>
                    <span className="flex gap-0.5">
                      {DAYS.map((d, i) => (
                        <span
                          key={i}
                          className={`w-3 text-center ${r.days.includes(i) ? "text-foreground" : "text-muted-foreground/40"}`}
                        >
                          {d}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => actions.toggleReminder(r.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${r.enabled ? "bg-primary" : "bg-secondary"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${r.enabled ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
                <button
                  onClick={() => actions.deleteReminder(r.id)}
                  className="h-8 w-8 grid place-items-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex gap-2">
            <input
              placeholder="Reminder label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input flex-1"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input w-28"
            />
            <button
              onClick={() => {
                if (!label.trim()) return;
                actions.addReminder({
                  type: "custom",
                  label: label.trim(),
                  time,
                  enabled: true,
                  days: [1, 2, 3, 4, 5],
                });
                setLabel("");
              }}
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
