"use client";

import Link from "next/link";
import { useState } from "react";

// ── mock data ────────────────────────────────────────────────────────────────

const mockCalorieGoal = 2000;
const initialMeals = [
  { id: "1", type: "Café da manhã", description: "Aveia com frutas vermelhas", calories: 380, time: "07:30" },
  { id: "2", type: "Almoço", description: "Frango grelhado com arroz integral", calories: 650, time: "12:15" },
  { id: "3", type: "Lanche", description: "Iogurte grego com granola", calories: 390, time: "15:00" },
];

const mealTypeStyle: Record<string, string> = {
  "Café da manhã": "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20",
  Almoço:          "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20",
  Lanche:          "text-sky-700 bg-sky-50 ring-1 ring-sky-600/20",
  Jantar:          "text-violet-700 bg-violet-50 ring-1 ring-violet-600/20",
  Ceia:            "text-pink-700 bg-pink-50 ring-1 ring-pink-600/20",
};

const PencilIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

// ── page ─────────────────────────────────────────────────────────────────────

export default function MealsPage() {
  const [meals, setMeals] = useState(initialMeals);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const total = meals.reduce((s, m) => s + m.calories, 0);
  const percent = Math.min(Math.round((total / mockCalorieGoal) * 100), 100);

  function handleDelete(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <div className="flex flex-col gap-6 pb-10">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Refeições</h1>
          <p className="text-sm font-medium text-zinc-500 mt-0.5 capitalize">{today}</p>
        </div>
        <Link href="/meals/new" className="shrink-0 bg-brand hover:bg-brand-dark text-white text-sm
          font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-[0.98] shadow-sm shadow-brand/20">
          + Nova refeição
        </Link>
      </div>

      {/* date nav */}
      <div className="flex items-center justify-between bg-white border border-zinc-100 rounded-2xl
        px-4 py-3 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
        <button className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 px-2 py-1 rounded-xl hover:bg-zinc-50 transition">
          ← anterior
        </button>
        <span className="text-sm font-bold text-zinc-800 capitalize">{today}</span>
        <button className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 px-2 py-1 rounded-xl hover:bg-zinc-50 transition">
          próximo →
        </button>
      </div>

      {/* daily summary */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total do dia</span>
          <span className="text-sm font-black text-zinc-900 tabular-nums">
            {total} <span className="text-zinc-400 font-medium">/ {mockCalorieGoal} kcal</span>
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* list */}
      {meals.length === 0 ? (
        <div className="bg-white border border-zinc-100 rounded-2xl p-12 text-center shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
          <p className="text-zinc-400 font-medium text-sm">Nenhuma refeição registrada hoje.</p>
          <Link href="/meals/new" className="mt-4 inline-block text-sm font-bold text-brand hover:text-brand-dark transition">
            + Adicionar refeição
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {meals.map((meal) => (
            <div key={meal.id} className="flex flex-col bg-white border border-zinc-100 rounded-2xl
              shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden
              hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-200">

              <div className="flex items-center gap-4 px-5 py-4">
                <span className="text-xs font-semibold text-zinc-400 w-10 shrink-0 tabular-nums">{meal.time}</span>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className={`self-start text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${mealTypeStyle[meal.type] ?? "text-zinc-500 bg-zinc-100"}`}>
                    {meal.type}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 truncate">{meal.description}</span>
                </div>
                <span className="text-sm font-black text-zinc-900 tabular-nums shrink-0">
                  {meal.calories} <span className="text-xs text-zinc-400 font-medium">kcal</span>
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/meals/${meal.id}/edit`} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition">
                    <PencilIcon />
                  </Link>
                  <button
                    onClick={() => setConfirmDeleteId(meal.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {/* inline delete confirm */}
              {confirmDeleteId === meal.id && (
                <div className="flex items-center justify-between gap-3 px-5 py-3 bg-red-50 border-t border-red-100">
                  <p className="text-xs font-semibold text-red-700">Excluir esta refeição?</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-100 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
