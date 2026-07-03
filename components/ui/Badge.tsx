import { cn } from "@/lib/utils";

export type BadgeTone = "emerald" | "amber" | "red" | "zinc" | "sky";

const TONE_CLASSES: Record<BadgeTone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export function Badge({
  children,
  tone = "zinc",
  className,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        TONE_CLASSES[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "emerald" && "bg-emerald-400",
            tone === "amber" && "bg-amber-400",
            tone === "red" && "bg-red-400",
            tone === "zinc" && "bg-zinc-400",
            tone === "sky" && "bg-sky-400"
          )}
        />
      )}
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeTone {
  switch (status.toLowerCase()) {
    case "approved":
    case "success":
    case "secure":
      return "emerald";
    case "pending":
    case "warning":
      return "amber";
    case "rejected":
    case "blocked":
    case "critical":
      return "red";
    default:
      return "zinc";
  }
}
