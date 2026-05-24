import { useStore } from "@/store";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
} as const;

export function Analytics() {
  const stats = useStore((s) => s.stats);
  const workouts = useStore((s) => s.workouts);

  const weekly = [...stats.slice(0, 7)].reverse().map((s) => ({
    day: new Date(s.date).toLocaleDateString("en", { weekday: "short" }),
    calories: s.caloriesBurned,
    minutes: s.workoutMinutes,
    water: s.water,
    sleep: s.sleep,
  }));

  const monthly = [...stats].reverse().map((s) => ({
    date: new Date(s.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    weight: s.weight,
    calories: s.caloriesBurned,
  }));

  const consistency = (() => {
    const map = new Map<string, number>();
    workouts.filter((w) => w.completed).forEach((w) => {
      const k = new Date(w.date).toLocaleDateString("en", { weekday: "short" });
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      day: d,
      sessions: map.get(d) ?? 0,
    }));
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Your body, in patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Weekly progress" sub="Calories burned per day">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weekly}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={32} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="calories" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#ga)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Weight changes" sub="Last 30 days">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthly}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} interval={4} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={["dataMin - 0.5", "dataMax + 0.5"]} width={32} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="weight" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Workout consistency" sub="Sessions by weekday">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={consistency}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={28} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
              <Bar dataKey="sessions" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sleep & hydration" sub="Hours / glasses per day">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weekly}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="sleep" stroke="var(--chart-5)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="water" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card p-6"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {children}
    </motion.div>
  );
}
