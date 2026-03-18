import { HabitLog, HabitWithStats, Habit } from './types'

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

/** Compute current streak: consecutive days ending today or yesterday */
export function computeCurrentStreak(dates: string[]): number {
  if (!dates.length) return 0

  const sorted = [...dates].sort().reverse() // descending
  const today = getTodayString()
  const yesterday = offsetDate(today, -1)

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const expected = offsetDate(sorted[i - 1], -1)
    if (sorted[i] === expected) {
      streak++
    } else {
      break
    }
  }
  return streak
}

/** Compute longest streak ever */
export function computeLongestStreak(dates: string[]): number {
  if (!dates.length) return 0

  const sorted = [...dates].sort() // ascending
  let longest = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const expected = offsetDate(sorted[i - 1], 1)
    if (sorted[i] === expected) {
      current++
      if (current > longest) longest = current
    } else if (sorted[i] !== sorted[i - 1]) {
      // reset (skip duplicates just in case)
      current = 1
    }
  }
  return longest
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

/** Attach stats to each habit */
export function buildHabitsWithStats(
  habits: Habit[],
  logs: HabitLog[],
  today: string
): HabitWithStats[] {
  const logsByHabit = new Map<string, HabitLog[]>()
  for (const log of logs) {
    const existing = logsByHabit.get(log.habit_id) ?? []
    existing.push(log)
    logsByHabit.set(log.habit_id, existing)
  }

  return habits.map((habit) => {
    const habitLogs = logsByHabit.get(habit.id) ?? []
    const dates = habitLogs.map((l) => l.completed_date)
    return {
      ...habit,
      logs: habitLogs,
      completedToday: dates.includes(today),
      currentStreak: computeCurrentStreak(dates),
      longestStreak: computeLongestStreak(dates),
      totalCompletions: habitLogs.length,
    }
  })
}
