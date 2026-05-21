import Link from "next/link";

const mockHistory = [
  { id: "1", type: "16:8", date: "21 mai", weekday: "Qua", startedAt: "08:00", endedAt: "00:00", duration: "16h 00min", completed: true },
  { id: "2", type: "18:6", date: "20 mai", weekday: "Ter", startedAt: "07:30", endedAt: "01:30", duration: "18h 05min", completed: true },
  { id: "3", type: "16:8", date: "19 mai", weekday: "Seg", startedAt: "09:00", endedAt: "18:40", duration: "09h 40min", completed: false },
  { id: "4", type: "20:4", date: "17 mai", weekday: "Sáb", startedAt: "08:00", endedAt: "04:00", duration: "20h 00min", completed: true },
  { id: "5", type: "16:8", date: "16 mai", weekday: "Sex", startedAt: "07:00", endedAt: "23:12", duration: "16h 12min", completed: true },
  { id: "6", type: "16:8", date: "15 mai", weekday: "Qui", startedAt: "08:30", endedAt: "11:00", duration: "02h 30min", completed: false },
  { id: "7", type: "24h",  date: "13 mai", weekday: "Ter", startedAt: "08:00", endedAt: "08:00", duration: "24h 00min", completed: true },
];

const completedCount = mockHistory.filter((f) => f.completed).length;

export default function FastingHistoryPage() {
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

      {/* summary */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Concluídos", value: completedCount, sub: `de ${mockHistory.length} registros` },
          { label: "Duração média", value: "17h 20min", sub: "por jejum concluído" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl px-4 py-4
            shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col gap-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-black text-zinc-900 leading-none mt-1">{value}</p>
            <p className="text-xs text-zinc-400 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* list */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-zinc-50">
          <h2 className="text-sm font-bold text-zinc-900">Todos os registros</h2>
        </div>
        <ul>
          {mockHistory.map((fast, i) => (
            <li key={fast.id} className={`flex items-center gap-4 px-5 py-4 ${i < mockHistory.length - 1 ? "border-b border-zinc-50" : ""}`}>
              <div className="w-10 shrink-0 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">{fast.weekday}</p>
                <p className="text-xs font-bold text-zinc-700">{fast.date}</p>
              </div>
              <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full shrink-0">{fast.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-400 tabular-nums">{fast.startedAt} → {fast.endedAt}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-black text-zinc-800 tabular-nums">{fast.duration}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  fast.completed
                    ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20"
                    : "text-zinc-500 bg-zinc-100"
                }`}>
                  {fast.completed ? "Concluído" : "Interrompido"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
