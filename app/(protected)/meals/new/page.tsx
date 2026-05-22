"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mealTypes = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Ceia"];
const mealTypeStyle: Record<string, string> = {
  "Café da manhã": "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20",
  Almoço:          "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20",
  Lanche:          "text-sky-700 bg-sky-50 ring-1 ring-sky-600/20",
  Jantar:          "text-violet-700 bg-violet-50 ring-1 ring-violet-600/20",
  Ceia:            "text-pink-700 bg-pink-50 ring-1 ring-pink-600/20",
};

export default function NewMealPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("Almoço");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const datetime = new Date(`${date}T${time}`).toISOString();

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: selectedType, description, calories: Number(calories), date: datetime }),
    });

    if (res.ok) {
      router.push("/meals");
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar refeição");
    }

    setLoading(false);
  }

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">{error}</p>
        )}

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

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Descrição do alimento</label>
          <div className="group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <input id="description" type="text" placeholder="Ex: Frango grelhado com arroz"
              value={description} onChange={(e) => setDescription(e.target.value)} required
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="calories" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Calorias</label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <input id="calories" type="number" min="0" placeholder="0"
              value={calories} onChange={(e) => setCalories(e.target.value)} required
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400 shrink-0">kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Data</label>
            <div className="group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="time" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Horário</label>
            <div className="group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
              <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/meals" className="flex-1 text-center py-3.5 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition">
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-3.5 text-sm rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5">
            {loading ? "Salvando..." : "Salvar refeição"}
          </button>
        </div>
      </form>
    </div>
  );
}
