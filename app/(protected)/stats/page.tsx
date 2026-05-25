"use client";

import { useState, useEffect } from "react";

type DayData = { date: string; calories: number; label: string };
type FastingDay = { date: string; hours: number; label: string };
type Stats = {
  avgCalories: number;
  completedFasts: number;
  avgFastHours: number;
  calorieGoal: number;
  days: DayData[];
  fastingDays: FastingDay[];
};

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  function loadStats() {
    setPageError(null);
    setStats(null);
    fetch("/api/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar estatísticas");
        return r.json();
      })
      .then(setStats)
      .catch(() => setPageError("Não foi possível carregar as estatísticas. Tente novamente."));
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (pageError) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Estatísticas</h1>
          <p className="text-sm font-medium text-zinc-500 mt-0.5">Últimos 7 dias</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-sm text-red-600 font-medium">{pageError}</p>
          <button onClick={loadStats} className="mt-3 text-sm font-bold text-red-600 hover:text-red-700 underline transition">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Estatísticas</h1>
          <p className="text-sm font-medium text-zinc-500 mt-0.5">Últimos 7 dias</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const { avgCalories, completedFasts, avgFastHours, calorieGoal, days, fastingDays } = stats;
  const maxCalories = Math.max(...days.map((d) => d.calories), calorieGoal, 1);
  const goalLinePercent = (calorieGoal / maxCalories) * 100;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Estatísticas</h1>
        <p className="text-sm font-medium text-zinc-500 mt-0.5">Últimos 7 dias</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Média diária", value: avgCalories.toLocaleString("pt-BR"), unit: "kcal" },
          { label: "Jejuns ok", value: `${completedFasts}`, unit: "esta semana" },
          { label: "Média jejum", value: `${avgFastHours}h`, unit: "por dia" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl px-4 py-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">{label}</p>
            <p className="text-2xl font-black text-zinc-900 leading-tight mt-1">{value}</p>
            <p className="text-[11px] text-zinc-400 font-medium">{unit}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900">Calorias por dia</h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
              <span className="w-5 border-t-2 border-dashed border-zinc-300" /> meta
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-brand">
              <span className="w-3 h-3 rounded bg-brand" /> consumido
            </span>
          </div>
        </div>

        <div className="relative h-40 flex items-end gap-2">
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-zinc-200 pointer-events-none"
            style={{ bottom: `${goalLinePercent}%` }}
          />
          {days.map(({ label, calories }) => {
            const h = maxCalories > 0 ? (calories / maxCalories) * 100 : 0;
            const over = calories > calorieGoal;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                  {calories > 0 ? (
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${over ? "bg-amber-400" : "bg-gradient-to-t from-brand to-brand-dark"}`}
                      style={{ height: `${h}%` }}
                      title={`${calories} kcal`}
                    />
                  ) : (
                    <div className="w-full h-1 rounded bg-zinc-100" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900">Horas de jejum por dia</h2>
          <span className="text-[11px] font-semibold text-zinc-400">max 24h</span>
        </div>

        <div className="relative h-40 flex items-end gap-2">
          {fastingDays.map(({ label, hours }) => {
            const h = (hours / 24) * 100;
            const met = hours >= 14;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                  {hours > 0 ? (
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${met ? "bg-gradient-to-t from-emerald-500 to-emerald-400" : "bg-zinc-200"}`}
                      style={{ height: `${h}%` }}
                      title={`${hours}h`}
                    />
                  ) : (
                    <div className="w-full h-1 rounded bg-zinc-100" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span className="w-3 h-3 rounded bg-emerald-400" /> Meta atingida (≥ 14h)
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
            <span className="w-3 h-3 rounded bg-zinc-200" /> Parcial ou nenhum
          </span>
        </div>
      </div>
    </div>
  );
}
