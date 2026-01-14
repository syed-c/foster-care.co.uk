import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, XCircle, Sparkles } from "lucide-react";

type BadgeVariant = "verified" | "unclaimed" | "pending" | "featured" | "error" | "default";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  verified: {
    bg: "bg-verified/15",
    text: "text-verified",
    border: "border-verified/25",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  unclaimed: {
    bg: "bg-unclaimed-light",
    text: "text-unclaimed-foreground",
    border: "border-unclaimed/25",
    icon: <Clock className="w-3 h-3" />,
  },
  pending: {
    bg: "bg-amber-500/15",
    text: "text-amber-600",
    border: "border-amber-500/25",
    icon: <Clock className="w-3 h-3" />,
  },
  featured: {
    bg: "bg-primary/15",
    text: "text-primary",
    border: "border-primary/25",
    icon: <Sparkles className="w-3 h-3" />,
  },
  error: {
    bg: "bg-destructive/15",
    text: "text-destructive",
    border: "border-destructive/25",
    icon: <XCircle className="w-3 h-3" />,
  },
  default: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

export function StatusBadge({ variant, children, className, showIcon = true }: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {showIcon && styles.icon}
      {children}
    </span>
  );
}
