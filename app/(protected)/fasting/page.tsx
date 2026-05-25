"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FastingStartSchema } from "@/lib/validations";

const mockStagesTemplate = [
  { name: "Açúcar no sangue cai", hours: 2 },
  { name: "Pico de insulina cai", hours: 8 },
  { name: "Queima de Gordura", hours: 12 },
  { name: "Cetose leve", hours: 16 },
  { name: "Autofagia profunda", hours: 24 },
];

function HistoryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${className || ""}`}>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function FastingCircle({ percent, elapsed, remaining }: { percent: number; elapsed: string; remaining: string }) {
  const radius = 130;
  const stroke = 18;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center py-6">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="#F4F4F5" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke="url(#brandGradient)" fill="transparent" strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
        />
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--brand-dark)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Decorrido</span>
        <span className="text-5xl font-black text-zinc-900 tracking-tighter">{elapsed}</span>
        <div className="mt-2 bg-brand-light px-3 py-1 rounded-full">
          <span className="text-xs font-bold text-brand">
            {percent >= 100 ? "Meta atingida!" : `Restam ${remaining}`}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatDuration(ms: number) {
  if (ms < 0) ms = 0;
  const totalMins = Math.floor(ms / 1000 / 60);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function getLocalDateTimeString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

const FASTING_PROTOCOLS = [
  { label: "12:12", hours: 12, desc: "Iniciante" },
  { label: "14:10", hours: 14, desc: "Intermediário" },
  { label: "16:8", hours: 16, desc: "Popular" },
  { label: "18:6", hours: 18, desc: "Avançado" },
  { label: "24h", hours: 24, desc: "Experiente" },
];

type FastingSession = { id: string; protocol: string; targetHours: number; startTime: string; status: string };
type HistoryItem = { id: string; startTime: string; endTime: string | null; targetHours: number; status: string; protocol: string };

export default function FastingPage() {
  const [activeFast, setActiveFast] = useState<FastingSession | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedGoal, setSelectedGoal] = useState(16);
  const [startDateStr, setStartDateStr] = useState("");
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startError, setStartError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setStartDateStr(getLocalDateTimeString());
    Promise.all([
      fetch("/api/fasting").then((r) => r.json()),
      fetch("/api/fasting/history").then((r) => r.json()),
    ]).then(([s, h]) => {
      if (s) setActiveFast(s);
      if (Array.isArray(h)) setHistory(h.slice(0, 3));
    }).finally(() => setPageLoading(false));
  }, []);

  useEffect(() => {
    if (!activeFast) return;
    const tick = () => {
      const start = new Date(activeFast.startTime).getTime();
      const now = Date.now();
      const goalMs = activeFast.targetHours * 3600000;
      const elapsed = Math.max(0, now - start);
      const remaining = Math.max(0, goalMs - elapsed);
      setElapsedMs(elapsed);
      setRemainingMs(remaining);
      setPercent((elapsed / goalMs) * 100);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeFast]);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setStartError("");

    const proto = FASTING_PROTOCOLS.find((p) => p.hours === selectedGoal);
    const validation = FastingStartSchema.safeParse({
      protocol: proto?.label ?? `${selectedGoal}h`,
      targetHours: selectedGoal,
      startTime: new Date(startDateStr).toISOString(),
    });
    if (!validation.success) {
      setStartError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/fasting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    if (res.ok) {
      const s = await res.json();
      setActiveFast(s);
    } else {
      const data = await res.json();
      setStartError(data.error ?? "Erro ao iniciar jejum");
    }
    setLoading(false);
  }

  async function handleStop() {
    if (!activeFast) return;
    setLoading(true);
    await fetch(`/api/fasting/${activeFast.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setActiveFast(null);
    setShowStopConfirm(false);
    setElapsedMs(0);
    setRemainingMs(0);
    setPercent(0);
    const h = await fetch("/api/fasting/history").then((r) => r.json());
    if (Array.isArray(h)) setHistory(h.slice(0, 3));
    setLoading(false);
  }

  const predictedEnd = new Date(new Date(startDateStr || Date.now()).getTime() + selectedGoal * 3600000);
  const predictedEndStr = predictedEnd.toLocaleString("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" });

  const elapsedHours = activeFast ? (elapsedMs / 3600000) : 0;
  let currentStageIndex = -1;
  for (let i = mockStagesTemplate.length - 1; i >= 0; i--) {
    if (elapsedHours >= mockStagesTemplate[i].hours) { currentStageIndex = i; break; }
  }
  const currentStageName = currentStageIndex >= 0 ? mockStagesTemplate[currentStageIndex].name : "Iniciando...";
  const dynamicStages = mockStagesTemplate.map((stage, i) => {
    const isPast = elapsedHours >= stage.hours;
    const isCurrent = i === currentStageIndex;
    return { ...stage, active: isPast || isCurrent, current: isCurrent };
  });

  function formatHistoryDuration(item: HistoryItem) {
    if (!item.endTime) return "-";
    const ms = new Date(item.endTime).getTime() - new Date(item.startTime).getTime();
    return formatDuration(ms);
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            {activeFast ? "Seu " : "Configurar "}
            <span className="text-brand">Jejum</span>
          </h1>
          <p className="text-sm font-semibold text-zinc-500">
            {activeFast ? "Acompanhe suas horas sem se alimentar." : "Defina seu protocolo e comece."}
          </p>
        </div>
        <Link href="/fasting/history" className="p-3 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shadow-sm">
          <HistoryIcon />
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/10 blur-[60px] rounded-full pointer-events-none" />

        {pageLoading ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-52 h-52 rounded-full bg-zinc-100 animate-pulse" />
            <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
          </div>
        ) : activeFast ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-1 mb-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest rounded-full ring-1 ring-emerald-600/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Jejum Ativo
              </span>
              <p className="text-sm text-zinc-500 font-medium mt-3">Meta: {activeFast.targetHours} horas</p>
            </div>
            <FastingCircle percent={percent} elapsed={formatDuration(elapsedMs)} remaining={formatDuration(remainingMs)} />
            <div className="flex items-center gap-2 mt-4 text-sm font-bold text-zinc-600 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
              <DropletIcon className="text-brand" />
              Estágio atual: <span className="text-zinc-900">{currentStageName}</span>
            </div>
            {showStopConfirm ? (
              <div className="w-full max-w-sm mt-8 bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-red-700 text-center">Encerrar o jejum agora?</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowStopConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-red-500 hover:bg-red-100 transition">Continuar</button>
                  <button onClick={handleStop} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition disabled:opacity-60">
                    {loading ? "Encerrando..." : "Encerrar"}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowStopConfirm(true)} className="w-full max-w-sm mt-8 bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/20 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98]">
                Encerrar Jejum
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleStart} className="flex flex-col gap-8 max-w-md mx-auto">
            {startError && (
              <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl">{startError}</p>
            )}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-zinc-900">Escolha o Protocolo</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {FASTING_PROTOCOLS.map((p) => (
                  <button key={p.hours} type="button" onClick={() => setSelectedGoal(p.hours)}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200 ${
                      selectedGoal === p.hours ? "border-brand bg-brand-light text-brand ring-1 ring-brand" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600"
                    }`}>
                    <span className="text-lg font-black">{p.hours}h</span>
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-zinc-400 text-center mt-1">
                Protocolo selecionado: <span className="text-zinc-600">{FASTING_PROTOCOLS.find(p => p.hours === selectedGoal)?.desc}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-zinc-900">Início do Jejum</label>
              <input type="datetime-local" value={startDateStr} onChange={(e) => setStartDateStr(e.target.value)} required
                className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3.5 rounded-2xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all duration-200" />
              <p className="text-xs font-medium text-zinc-500">
                Seu jejum terminará <span className="font-bold text-zinc-900">aprox. {predictedEndStr}</span>.
              </p>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/30 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-60 mt-2">
              {loading ? "Iniciando..." : "Iniciar Jejum"}
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-6">Estágios do Jejum</h2>
          <div className="flex flex-col gap-0">
            {dynamicStages.map((stage, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shrink-0 z-10 transition-colors duration-500 ${stage.current ? "bg-brand ring-4 ring-brand-light" : stage.active ? "bg-brand" : "bg-zinc-200"}`} />
                  {i < dynamicStages.length - 1 && (
                    <div className={`w-0.5 h-full my-1 rounded-full transition-colors duration-500 ${stage.active && dynamicStages[i+1].active ? "bg-brand" : "bg-zinc-100"}`} />
                  )}
                </div>
                <div className={`pb-6 -mt-1 ${stage.active ? "opacity-100" : "opacity-40"} transition-opacity duration-500`}>
                  <p className={`text-sm font-bold transition-colors duration-500 ${stage.current ? "text-brand" : "text-zinc-900"}`}>{stage.name}</p>
                  <p className="text-xs font-semibold text-zinc-400 mt-0.5">Após {stage.hours}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">Últimos Jejuns</h2>
            <Link href="/fasting/history" className="text-xs font-bold text-brand hover:text-brand-dark transition-colors">Ver todos →</Link>
          </div>
          {history.length === 0 ? (
            <div className="flex items-center justify-center flex-1 py-8">
              <p className="text-sm text-zinc-400 font-medium">Nenhum jejum registrado ainda.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {history.map((fast) => {
                const dateLabel = new Date(fast.startTime).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
                const success = fast.status === "completed";
                return (
                  <li key={fast.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-zinc-900">{dateLabel}</span>
                      <span className="text-xs font-medium text-zinc-500">Meta: {fast.targetHours}h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-zinc-900">{formatHistoryDuration(fast)}</span>
                      {success ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">✓</span>
                      ) : (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">×</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
