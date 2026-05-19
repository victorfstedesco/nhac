import Link from "next/link";

// ── mock data ────────────────────────────────────────────────────────────────

const mockUser = { name: "Maria" };
const mockCalories = { consumed: 1420, goal: 2000 };
const mockFasting = {
  active: true,
  type: "16:8",
  startedAt: "08:00",
  elapsed: "6h 23min",
  remaining: "9h 37min",
};
const mockMeals = [
  { id: 1, type: "Café da manhã", description: "Aveia com frutas vermelhas", calories: 380, time: "07:30" },
  { id: 2, type: "Almoço", description: "Frango grelhado com arroz integral", calories: 650, time: "12:15" },
  { id: 3, type: "Lanche", description: "Iogurte grego com granola", calories: 390, time: "15:00" },
];
const mockWeekly = {
  avgCalories: 1680,
  completedFasts: 3,
  avgFastDuration: "17h 20min",
};

// ── helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const caloriePercent = Math.min(
  Math.round((mockCalories.consumed / mockCalories.goal) * 100),
  100
);

const mealTypeStyle: Record<string, string> = {
  "Café da manhã": "text-amber-700 bg-amber-50 ring-1 ring-amber-600/20",
  Almoço: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20",
  Lanche: "text-sky-700 bg-sky-50 ring-1 ring-sky-600/20",
  Jantar: "text-violet-700 bg-violet-50 ring-1 ring-violet-600/20",
  Ceia: "text-pink-700 bg-pink-50 ring-1 ring-pink-600/20",
};

// ── SVGs ─────────────────────────────────────────────────────────────────────

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-brand">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-500">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-500">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 15"/>
  </svg>
);

// ── page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const remaining = mockCalories.goal - mockCalories.consumed;

  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* greeting */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest capitalize">
          {today}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          {getGreeting()}, <span className="text-brand">{mockUser.name}</span>
        </h1>
      </div>

      {/* calories + fasting */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        {/* calories — larger */}
        <div className="md:col-span-3 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-6 sm:p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-brand-light rounded-xl">
                  <FlameIcon />
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Calorias hoje
                </p>
              </div>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black text-zinc-900 tracking-tighter">
                  {mockCalories.consumed.toLocaleString("pt-BR")}
                </span>
                <span className="text-lg text-zinc-400 font-semibold">
                  / {mockCalories.goal.toLocaleString("pt-BR")} kcal
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                Restam{" "}
                <span className="font-bold text-zinc-900">
                  {remaining.toLocaleString("pt-BR")} kcal
                </span>
              </p>
            </div>
            <span
              className={`text-sm font-bold px-3 py-1.5 rounded-full tracking-wide ring-1 ${
                caloriePercent >= 100
                  ? "bg-red-50 text-red-600 ring-red-600/20"
                  : caloriePercent >= 80
                  ? "bg-amber-50 text-amber-600 ring-amber-600/20"
                  : "bg-brand-light text-brand ring-brand/20"
              }`}
            >
              {caloriePercent}%
            </span>
          </div>

          {/* progress bar */}
          <div className="flex flex-col gap-2 mt-8">
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
            <div className="flex justify-between px-1">
              <span className="text-xs font-medium text-zinc-400">0</span>
              <span className="text-xs font-medium text-zinc-400">meta: {mockCalories.goal}</span>
            </div>
          </div>
        </div>

        {/* fasting */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-6 sm:p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <TimerIcon />
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Jejum
                </p>
              </div>
              {mockFasting.active && (
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-600/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  {mockFasting.type}
                </span>
              )}
            </div>

            {mockFasting.active ? (
              <div className="mt-2">
                <p className="text-4xl font-black text-zinc-900 tracking-tighter">
                  {mockFasting.elapsed}
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  Faltam{" "}
                  <span className="font-bold text-zinc-900">{mockFasting.remaining}</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 mt-2 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <p className="text-sm font-medium text-zinc-400">Nenhum jejum ativo</p>
              </div>
            )}
          </div>

          <Link
            href="/fasting"
            className="group mt-6 inline-flex items-center justify-between w-full text-sm font-bold text-zinc-900 bg-zinc-50 hover:bg-zinc-100 p-3 rounded-xl transition-colors duration-200"
          >
            {mockFasting.active ? "Encerrar jejum" : "Iniciar jejum"}
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* weekly stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Média diária", value: `${mockWeekly.avgCalories}`, unit: "kcal", sub: "últimos 7 dias", icon: <ActivityIcon />, bg: "bg-brand-light", iconColor: "text-brand" },
          { label: "Jejuns concluídos", value: `${mockWeekly.completedFasts}`, unit: "", sub: "esta semana", icon: <CheckCircleIcon />, bg: "bg-emerald-50", iconColor: "text-emerald-500" },
          { label: "Duração média", value: mockWeekly.avgFastDuration, unit: "", sub: "por jejum", icon: <ClockIcon />, bg: "bg-blue-50", iconColor: "text-blue-500" },
        ].map(({ label, value, unit, sub, icon, bg }) => (
          <div key={label} className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 p-6 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${bg}`}>
                {icon}
              </div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-none">
                {label}
              </p>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-zinc-900 tracking-tight group-hover:text-brand transition-colors duration-300">{value}</span>
              {unit && <span className="text-sm text-zinc-400 font-semibold">{unit}</span>}
            </div>
            <p className="text-xs font-medium text-zinc-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* today's meals */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100/80 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-zinc-900">Refeições de hoje</h2>
            <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2 py-0.5 rounded-full">{mockMeals.length}</span>
          </div>
          <Link
            href="/meals"
            className="text-sm font-bold text-brand hover:text-brand-dark transition-colors group flex items-center gap-1"
          >
            Ver todas <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {mockMeals.length === 0 ? (
          <div className="px-8 py-16 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl opacity-50">🍽️</span>
            </div>
            <p className="text-base font-medium text-zinc-500">Nenhuma refeição registrada hoje.</p>
            <Link href="/meals/new" className="mt-2 text-sm font-bold text-white bg-brand hover:bg-brand-dark px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-brand/20">
              Adicionar refeição
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {mockMeals.map((meal) => (
              <li
                key={meal.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-4 sm:py-5 gap-4 hover:bg-zinc-50/80 transition-colors duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-zinc-100 text-zinc-500 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 tabular-nums">
                    {meal.time}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          mealTypeStyle[meal.type] ?? "text-zinc-600 bg-zinc-100 ring-1 ring-zinc-200"
                        }`}
                      >
                        {meal.type}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-zinc-900 truncate group-hover:text-brand transition-colors duration-200">
                      {meal.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center sm:justify-end gap-2 shrink-0 pl-16 sm:pl-0">
                  <span className="text-lg font-black text-zinc-900 tabular-nums">
                    {meal.calories}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">kcal</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

