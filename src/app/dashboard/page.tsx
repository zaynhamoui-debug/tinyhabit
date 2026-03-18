import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { buildHabitsWithStats, getTodayString } from '@/lib/utils'
import { Habit, HabitLog } from '@/lib/types'
import StatsBar from '@/components/StatsBar'
import HabitGrid from '@/components/HabitGrid'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = getTodayString()

  // Fetch habits
  const { data: habitsData, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (habitsError) throw new Error(habitsError.message)
  const habits = (habitsData ?? []) as Habit[]

  // Fetch all logs for those habits
  let logs: HabitLog[] = []
  if (habits.length > 0) {
    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .in(
        'habit_id',
        habits.map((h) => h.id)
      )
      .order('completed_date', { ascending: true })
    logs = (logsData ?? []) as HabitLog[]
  }

  const habitsWithStats = buildHabitsWithStats(habits, logs, today)

  const completedToday = habitsWithStats.filter((h) => h.completedToday).length
  const bestStreak = habitsWithStats.reduce((max, h) => Math.max(max, h.currentStreak), 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-0.5 text-sm">{formatDate(today)}</p>
      </div>

      <StatsBar
        total={habits.length}
        completedToday={completedToday}
        bestStreak={bestStreak}
      />

      <HabitGrid habits={habitsWithStats} today={today} />
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
