"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw, Plus, ShieldCheck, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SecretCard } from "@/components/secrets/SecretCard";
import { NewSecretModal } from "@/components/secrets/NewSecretModal";
import { createSecret, rotateSecret } from "@/app/actions/secrets";
import { Secret } from "@/lib/types";

export function SecretsVaultClient({ secrets }: { secrets: Secret[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isRotatingAll, startRotateAll] = useTransition();
  const [rotateMessage, setRotateMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleCreateSecret(payload: { environment: Secret["environment"]; name: string; value: string }) {
    const result = await createSecret(payload);
    if (result.success) {
      router.refresh();
    }
    return result;
  }

  function handleRotateAll() {
    startRotateAll(async () => {
      await Promise.all(secrets.map((s) => rotateSecret({ id: s.id })));
      setRotateMessage(`Rotated ${secrets.length} secret${secrets.length === 1 ? "" : "s"}.`);
      router.refresh();
      setTimeout(() => setRotateMessage(null), 3000);
    });
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Encrypted Environment
        </span>
        <div className="flex items-center gap-2">
          {rotateMessage && <span className="text-xs text-emerald-400">{rotateMessage}</span>}
          <button
            onClick={handleRotateAll}
            disabled={isRotatingAll || secrets.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            {isRotatingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCw className="h-3.5 w-3.5" />
            )}
            Rotate Keys
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> New Secret
          </button>
        </div>
      </div>

      {secrets.length === 0 ? (
        <Card className="p-8 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="font-display text-sm font-semibold text-zinc-200">No secrets yet</p>
          <p className="mt-1 text-xs text-zinc-500">
            Environment variables and API credentials will be managed here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {secrets.map((s) => (
            <SecretCard key={s.id} secret={s} />
          ))}
        </div>
      )}

      <NewSecretModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateSecret} />
    </>
  );
}
