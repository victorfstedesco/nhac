const calorieGoal = 2000;

const weeklyCalories = [
  { day: "Seg", calories: 1820 },
  { day: "Ter", calories: 1540 },
  { day: "Qua", calories: 2100 },
  { day: "Qui", calories: 1680 },
  { day: "Sex", calories: 1420 },
  { day: "Sáb", calories: 1950 },
  { day: "Dom", calories: 1320 },
];

const weeklyFasting = [
  { day: "Seg", hours: 16 },
  { day: "Ter", hours: 18 },
  { day: "Qua", hours: 0 },
  { day: "Qui", hours: 16.5 },
  { day: "Sex", hours: 6.4 },
  { day: "Sáb", hours: 20 },
  { day: "Dom", hours: 16 },
];

const maxCalories  = Math.max(...weeklyCalories.map((d) => d.calories), calorieGoal);
const avgCalories  = Math.round(weeklyCalories.reduce((s, d) => s + d.calories, 0) / 7);
const completedFasts = weeklyFasting.filter((d) => d.hours >= 14).length;
const avgFastHours = (
  weeklyFasting.filter((d) => d.hours > 0).reduce((s, d) => s + d.hours, 0) /
  weeklyFasting.filter((d) => d.hours > 0).length
).toFixed(1);

export default function StatsPage() {
  const goalLinePercent = (calorieGoal / maxCalories) * 100;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Estatísticas</h1>
        <p className="text-sm font-medium text-zinc-500 mt-0.5">Últimos 7 dias</p>
      </div>

      {/* aggregate */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Média diária", value: avgCalories.toLocaleString("pt-BR"), unit: "kcal" },
          { label: "Jejuns ok", value: `${completedFasts}`, unit: "esta semana" },
          { label: "Média jejum", value: `${avgFastHours}h`, unit: "por dia" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl px-4 py-4
            shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">{label}</p>
            <p className="text-2xl font-black text-zinc-900 leading-tight mt-1">{value}</p>
            <p className="text-[11px] text-zinc-400 font-medium">{unit}</p>
          </div>
        ))}
      </div>

      {/* calorie chart */}
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
          <div className="absolute inset-x-0 border-t-2 border-dashed border-zinc-200 pointer-events-none"
            style={{ bottom: `${goalLinePercent}%` }} />
          {weeklyCalories.map(({ day, calories }) => {
            const h = (calories / maxCalories) * 100;
            const over = calories > calorieGoal;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                  <div className={`w-full rounded-t-lg transition-all duration-700 ${over ? "bg-amber-400" : "bg-gradient-to-t from-brand to-brand-dark"}`}
                    style={{ height: `${h}%` }} title={`${calories} kcal`} />
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* fasting chart */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900">Horas de jejum por dia</h2>
          <span className="text-[11px] font-semibold text-zinc-400">max 24h</span>
        </div>

        <div className="relative h-40 flex items-end gap-2">
          {weeklyFasting.map(({ day, hours }) => {
            const h = (hours / 24) * 100;
            const met = hours >= 14;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: 140 }}>
                  {hours > 0 ? (
                    <div className={`w-full rounded-t-lg transition-all duration-700 ${met ? "bg-gradient-to-t from-emerald-500 to-emerald-400" : "bg-zinc-200"}`}
                      style={{ height: `${h}%` }} title={`${hours}h`} />
                  ) : (
                    <div className="w-full h-1 rounded bg-zinc-100" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{day}</span>
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
