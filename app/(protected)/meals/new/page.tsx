"use client";

import Link from "next/link";
import { useState } from "react";

const mealTypes = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Ceia"];
const mealTypeStyle: Record<string, string> = {
  "Café da manhã": "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20",
  Almoço:          "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20",
  Lanche:          "text-sky-700 bg-sky-50 ring-1 ring-sky-600/20",
  Jantar:          "text-violet-700 bg-violet-50 ring-1 ring-violet-600/20",
  Ceia:            "text-pink-700 bg-pink-50 ring-1 ring-pink-600/20",
};

export default function NewMealPage() {
  const [selectedType, setSelectedType] = useState("Almoço");

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-lg">
      <div>
        <Link href="/meals" className="text-xs font-bold text-zinc-400 hover:text-zinc-700 uppercase tracking-wider transition">
          ← Voltar
        </Link>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mt-2">
          Nova <span className="text-brand">refeição</span>
        </h1>
      </div>

      <form className="flex flex-col gap-5">
        {/* type selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Tipo de refeição</label>
          <div className="flex flex-wrap gap-2">
            {mealTypes.map((type) => (
              <button key={type} type="button" onClick={() => setSelectedType(type)}
                className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full transition-all ${
                  selectedType === type ? mealTypeStyle[type] : "text-zinc-500 bg-zinc-100 hover:bg-zinc-200"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            Descrição do alimento
          </label>
          <div className="group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <input id="description" type="text" placeholder="Ex: Frango grelhado com arroz"
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium" />
          </div>
        </div>

        {/* calories */}
        <div className="flex flex-col gap-2">
          <label htmlFor="calories" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            Calorias
          </label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <input id="calories" type="number" min="0" placeholder="0"
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400 shrink-0">kcal</span>
          </div>
        </div>

        {/* date + time */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "date", label: "Data", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
            { id: "time", label: "Horário", type: "time", defaultValue: new Date().toTimeString().slice(0, 5) },
          ].map(({ id, label, type, defaultValue }) => (
            <div key={id} className="flex flex-col gap-2">
              <label htmlFor={id} className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
              <div className="group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl
                focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
                <input id={id} type={type} defaultValue={defaultValue}
                  className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none" />
              </div>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="flex gap-3 pt-2">
          <Link href="/meals" className="flex-1 text-center py-3.5 rounded-2xl border border-zinc-200
            text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition">
            Cancelar
          </Link>
          <button type="submit" className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-3.5 text-sm
            rounded-2xl transition-all active:scale-[0.98] shadow-sm shadow-brand/20
            hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5">
            Salvar refeição
          </button>
        </div>
      </form>
    </div>
  );
}
