"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check, RotateCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Secret } from "@/lib/types";

const STATUS_DOT: Record<Secret["status"], string> = {
  secure: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

const STATUS_LABEL: Record<Secret["status"], string> = {
  secure: "Production",
  warning: "Live Payment",
  critical: "Critical Data",
};

export function SecretCard({ secret }: { secret: Secret }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyValue() {
    navigator.clipboard?.writeText(secret.revealedValue).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function handleRotate() {
    // In production, this would trigger a Server Action to rotate the credential
    console.log("Rotating credential:", secret.name);
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[secret.status])} />
          {secret.environment}
        </span>
        <div className="flex gap-1">
          <button
            onClick={handleRotate}
            aria-label="Rotate credential"
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={copyValue}
            aria-label="Copy secret value"
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <p className="fig mb-2 text-sm font-semibold text-zinc-100">{secret.name}</p>

      <div className="group flex items-center justify-between rounded-lg bg-zinc-900/60 px-3 py-2">
        <span className="fig truncate text-xs text-zinc-400 select-none">
          {revealed ? secret.revealedValue : secret.maskedValue}
        </span>
        <button
          onClick={() => setRevealed((r) => !r)}
          onMouseLeave={() => setRevealed(false)}
          aria-label={revealed ? "Hide secret" : "Reveal secret"}
          className="ml-2 shrink-0 text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Card>
  );
}
