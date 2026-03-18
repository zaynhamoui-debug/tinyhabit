export interface Habit {
  id: string
  user_id: string
  name: string
  emoji: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}

export interface HabitWithStats extends Habit {
  logs: HabitLog[]
  completedToday: boolean
  currentStreak: number
  longestStreak: number
  totalCompletions: number
}

export interface HabitFormState {
  error?: string
  success?: boolean
}

export const PRESET_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#64748b', // slate
] as const
