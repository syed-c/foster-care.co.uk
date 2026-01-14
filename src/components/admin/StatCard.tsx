import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "verified" | "warm" | "trust";
  onClick?: () => void;
}

const variantStyles = {
  default: {
    icon: "bg-muted text-foreground",
    value: "text-foreground",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-primary",
  },
  verified: {
    icon: "bg-verified/10 text-verified",
    value: "text-verified",
  },
  warm: {
    icon: "bg-warm/10 text-warm",
    value: "text-warm",
  },
  trust: {
    icon: "bg-trust/10 text-trust",
    value: "text-trust",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  onClick,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border p-5 transition-all",
        onClick && "cursor-pointer hover:shadow-card hover:border-primary/30 hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={cn("text-3xl font-bold mt-1 tracking-tight", styles.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-verified" : "text-destructive"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-2xl", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
