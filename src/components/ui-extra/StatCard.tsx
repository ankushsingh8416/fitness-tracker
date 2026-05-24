import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
  children?: ReactNode;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendUp,
  accent = "var(--primary)",
  children,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="soft-card p-5 hover:border-foreground/15 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center"
            style={{ background: `color-mix(in oklab, ${accent} 14%, transparent)` }}
          >
            <Icon className="h-4 w-4" style={{ color: accent }} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">{label}</span>
        </div>
        {trend && (
          <span
            className={`text-[11px] font-medium tabular-nums px-2 py-0.5 rounded-full ${trendUp ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
}
