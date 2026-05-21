"use client";

import { useState } from "react";

const mockUser = { name: "Maria Silva", email: "maria@email.com", calorieGoal: 2000 };

const LogoutIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function SettingsPage() {
  const [goal, setGoal] = useState(mockUser.calorieGoal);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-lg">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Configurações</h1>
        <p className="text-sm font-medium text-zinc-500 mt-0.5">Perfil e preferências</p>
      </div>

      {/* profile */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-5">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Perfil</h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="text-xl font-black text-white">{mockUser.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-base font-bold text-zinc-900">{mockUser.name}</p>
            <p className="text-sm font-medium text-zinc-400">{mockUser.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { id: "name", label: "Nome", type: "text", defaultValue: mockUser.name },
            { id: "email", label: "E-mail", type: "email", defaultValue: mockUser.email },
          ].map(({ id, label, type, defaultValue }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{label}</label>
              <div className="group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3 rounded-2xl
                focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
                <input id={id} type={type} defaultValue={defaultValue}
                  className="flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* calorie goal */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-5">
        <div>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Meta calórica</h2>
          <p className="text-xs font-medium text-zinc-400 mt-1">Quantidade de calorias que você pretende consumir por dia.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="goal" className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Calorias diárias</label>
          <div className="group flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3 rounded-2xl
            focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200">
            <input id="goal" type="number" min="500" max="6000" step="50" value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="flex-1 bg-transparent text-sm font-bold text-zinc-900 outline-none tabular-nums" />
            <span className="text-sm font-medium text-zinc-400 shrink-0">kcal / dia</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[1500, 1800, 2000, 2200, 2500].map((preset) => (
            <button key={preset} type="button" onClick={() => setGoal(preset)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                goal === preset
                  ? "bg-brand text-white shadow-sm shadow-brand/30"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}>
              {preset}
            </button>
          ))}
        </div>
      </section>

      {/* save */}
      <button type="button" onClick={handleSave}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] ${
          saved
            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-400/30"
            : "bg-brand hover:bg-brand-dark text-white shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5"
        }`}>
        {saved ? "✓ Salvo com sucesso" : "Salvar alterações"}
      </button>

      {/* logout */}
      <div className="pt-2 border-t border-zinc-100">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
          text-sm font-bold text-red-500 hover:bg-red-50 transition">
          <LogoutIcon /> Sair da conta
        </button>
      </div>

      <p className="text-xs text-zinc-300 text-center font-medium leading-relaxed">
        Este aplicativo não substitui orientação médica ou nutricional profissional.
      </p>
    </div>
  );
}
