"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SettingsSchema, ChangePasswordSchema } from "@/lib/validations";

const LogoutIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

type User = { id: string; name: string; email: string; calorieGoal: number };

export default function SettingsPage() {
  const router = useRouter();

  // — perfil
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState(2000);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  // — page load
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // — trocar senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar configurações");
        return r.json();
      })
      .then((u: User) => {
        setUser(u);
        setName(u.name);
        setEmail(u.email);
        setGoal(u.calorieGoal);
      })
      .catch(() => setPageError("Não foi possível carregar as configurações. Tente recarregar."))
      .finally(() => setPageLoading(false));
  }, []);

  async function handleSave() {
    setSaveError("");

    const validation = SettingsSchema.safeParse({ name, email, calorieGoal: goal });
    if (!validation.success) {
      setSaveError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const data = await res.json();
      setSaveError(data.error ?? "Erro ao salvar alterações");
    }
    setLoading(false);
  }

  async function handleChangePassword() {
    setPwError("");

    if (newPassword !== confirmPassword) {
      setPwError("As senhas não coincidem");
      return;
    }

    const validation = ChangePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!validation.success) {
      setPwError(validation.error.issues[0].message);
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      if (res.ok) {
        setPwSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPwSaved(false), 2500);
      } else {
        setPwError(data.error ?? "Erro ao alterar senha");
      }
    } catch {
      setPwError("Erro ao processar solicitação");
    }
    setPwLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  const inputClass = "flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:font-medium";
  const fieldWrap = "group flex items-center border border-zinc-200 bg-zinc-50 px-4 py-3 rounded-2xl focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10 focus-within:bg-white transition-all duration-200";
  const labelClass = "text-xs font-bold text-zinc-600 uppercase tracking-widest";

  if (pageLoading) {
    return (
      <div className="flex flex-col gap-6 pb-10 max-w-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Configurações</h1>
          <p className="text-sm font-medium text-zinc-500 mt-0.5">Perfil e preferências</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-zinc-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col gap-6 pb-10 max-w-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Configurações</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-sm text-red-600 font-medium">{pageError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-lg">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Configurações</h1>
        <p className="text-sm font-medium text-zinc-500 mt-0.5">Perfil e preferências</p>
      </div>

      {/* — Perfil — */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-5">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Perfil</h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="text-xl font-black text-white">{(user?.name ?? "?").charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-base font-bold text-zinc-900">{user?.name ?? "..."}</p>
            <p className="text-sm font-medium text-zinc-400">{user?.email ?? "..."}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { id: "name", label: "Nome", type: "text", value: name, onChange: setName },
            { id: "email", label: "E-mail", type: "email", value: email, onChange: setEmail },
          ].map(({ id, label, type, value, onChange }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <label htmlFor={id} className={labelClass}>{label}</label>
              <div className={fieldWrap}>
                <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* — Meta calórica — */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-5">
        <div>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Meta calórica</h2>
          <p className="text-xs font-medium text-zinc-400 mt-1">Quantidade de calorias que você pretende consumir por dia.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="goal" className={labelClass}>Calorias diárias</label>
          <div className={`${fieldWrap} gap-3`}>
            <input id="goal" type="number" min="500" max="10000" step="50" value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="flex-1 bg-transparent text-sm font-bold text-zinc-900 outline-none tabular-nums" />
            <span className="text-sm font-medium text-zinc-400 shrink-0">kcal / dia</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[1500, 1800, 2000, 2200, 2500].map((preset) => (
            <button key={preset} type="button" onClick={() => setGoal(preset)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                goal === preset ? "bg-brand text-white shadow-sm shadow-brand/30" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}>
              {preset}
            </button>
          ))}
        </div>
      </section>

      {saveError && (
        <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">{saveError}</p>
      )}

      <button type="button" onClick={handleSave} disabled={loading}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 ${
          saved
            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-400/30"
            : "bg-brand hover:bg-brand-dark text-white shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5"
        }`}>
        {saved ? "✓ Salvo com sucesso" : loading ? "Salvando..." : "Salvar alterações"}
      </button>

      {/* — Segurança — */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-5">
        <div>
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Segurança</h2>
          <p className="text-xs font-medium text-zinc-400 mt-1">Altere sua senha a qualquer momento.</p>
        </div>

        {pwError && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">
            {pwError}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="currentPassword" className={labelClass}>Senha atual</label>
            <div className={fieldWrap}>
              <input id="currentPassword" type="password" autoComplete="current-password"
                placeholder="Digite sua senha atual"
                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className={labelClass}>Nova senha</label>
            <div className={fieldWrap}>
              <input id="newPassword" type="password" autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className={labelClass}>Confirmar nova senha</label>
            <div className={fieldWrap}>
              <input id="confirmPassword" type="password" autoComplete="new-password"
                placeholder="Repita a nova senha"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass} />
            </div>
          </div>
        </div>

        <button type="button" onClick={handleChangePassword} disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${
            pwSaved
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-400/30"
              : "bg-zinc-900 hover:bg-zinc-700 text-white shadow-sm hover:-translate-y-0.5"
          }`}>
          {pwSaved ? "✓ Senha alterada" : pwLoading ? "Salvando..." : "Alterar senha"}
        </button>
      </section>

      <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1">
        <a
          href="/api/export?format=csv"
          download
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition"
        >
          <DownloadIcon /> Exportar dados (CSV)
        </a>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition">
          <LogoutIcon /> Sair da conta
        </button>
      </div>

      <p className="text-xs text-zinc-300 text-center font-medium leading-relaxed">
        Este aplicativo não substitui orientação médica ou nutricional profissional.
      </p>
    </div>
  );
}
