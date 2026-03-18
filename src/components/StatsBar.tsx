interface Props {
  total: number
  completedToday: number
  bestStreak: number
}

export default function StatsBar({ total, completedToday, bestStreak }: Props) {
  const pct = total > 0 ? Math.round((completedToday / total) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <StatCard
        value={total.toString()}
        label="Total habits"
        icon="📋"
      />
      <StatCard
        value={`${completedToday}/${total}`}
        label="Done today"
        icon="✅"
        sub={total > 0 ? `${pct}%` : undefined}
        highlight={total > 0 && completedToday === total}
      />
      <StatCard
        value={`${bestStreak}d`}
        label="Best streak"
        icon="🔥"
      />
    </div>
  )
}

function StatCard({
  value,
  label,
  icon,
  sub,
  highlight,
}: {
  value: string
  label: string
  icon: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-4 flex flex-col gap-1 shadow-sm transition-colors ${
        highlight ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {sub && <span className="text-sm text-slate-400">{sub}</span>}
      </div>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
  )
}
