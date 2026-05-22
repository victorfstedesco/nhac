"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type FastingSession = {
  id: string;
  protocol: string;
  targetHours: number;
  startTime: string;
  endTime: string | null;
  status: string;
};

function formatDuration(ms: number) {
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

export default function FastingHistoryPage() {
  const [history, setHistory] = useState<FastingSession[]>([]);

  useEffect(() => {
    fetch("/api/fasting/history").then((r) => r.json()).then((h) => {
      if (Array.isArray(h)) setHistory(h);
    });
  }, []);

  const completedCount = history.filter((f) => f.status === "completed").length;
  const completedWithEnd = history.filter((f) => f.status === "completed" && f.endTime);
  const avgMs = completedWithEnd.length > 0
    ? completedWithEnd.reduce((s, f) => s + (new Date(f.endTime!).getTime() - new Date(f.startTime).getTime()), 0) / completedWithEnd.length
    : 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <Link href="/fasting" className="text-xs font-bold text-zinc-400 hover:text-zinc-700 uppercase tracking-wider transition">
          ← Jejum
        </Link>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mt-2">
          Histórico de <span className="text-brand">jejuns</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Concluídos", value: completedCount, sub: `de ${history.length} registros` },
          { label: "Duração média", value: avgMs > 0 ? formatDuration(avgMs) : "-", sub: "por jejum concluído" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl px-4 py-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-black text-zinc-900 leading-none mt-1">{value}</p>
            <p className="text-xs text-zinc-400 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-zinc-50">
          <h2 className="text-sm font-bold text-zinc-900">Todos os registros</h2>
        </div>
        {history.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-zinc-400 font-medium">Nenhum jejum registrado ainda.</p>
          </div>
        ) : (
          <ul>
            {history.map((fast, i) => {
              const start = new Date(fast.startTime);
              const end = fast.endTime ? new Date(fast.endTime) : null;
              const duration = end ? formatDuration(end.getTime() - start.getTime()) : "-";
              const completed = fast.status === "completed";
              const weekday = start.toLocaleDateString("pt-BR", { weekday: "short" });
              const dateLabel = start.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
              const startTime = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              const endTime = end ? end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--";

              return (
                <li key={fast.id} className={`flex items-center gap-4 px-5 py-4 ${i < history.length - 1 ? "border-b border-zinc-50" : ""}`}>
                  <div className="w-10 shrink-0 text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">{weekday}</p>
                    <p className="text-xs font-bold text-zinc-700">{dateLabel}</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full shrink-0">{fast.protocol}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-400 tabular-nums">{startTime} → {endTime}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-black text-zinc-800 tabular-nums">{duration}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      completed ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20" : "text-zinc-500 bg-zinc-100"
                    }`}>
                      {completed ? "Concluído" : "Interrompido"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
