'use client'

import { useState, useTransition } from 'react'
import { toggleHabitLog } from '@/actions/habits'
import { HabitWithStats } from '@/lib/types'
import HabitForm from './HabitForm'
import DeleteModal from './DeleteModal'

interface Props {
  habit: HabitWithStats
  today: string
}

export default function HabitCard({ habit, today }: Props) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isToggling, startToggle] = useTransition()

  const done = habit.completedToday

  function handleToggle() {
    startToggle(async () => {
      await toggleHabitLog(habit.id, today, done)
    })
  }

  return (
    <>
      <div
        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          done ? 'border-emerald-200' : 'border-slate-200'
        }`}
      >
        {/* Color strip */}
        <div className="h-1.5 w-full" style={{ backgroundColor: habit.color }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              {habit.emoji && <span className="text-xl shrink-0">{habit.emoji}</span>}
              <h3
                className="font-semibold text-slate-900 truncate"
                title={habit.name}
              >
                {habit.name}
              </h3>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={() => setShowEdit(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
              done
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {isToggling ? (
              <span className="opacity-70">Updating…</span>
            ) : done ? (
              <>
                <span>✓</span> Completed
              </>
            ) : (
              <>
                <span>○</span> Mark Complete
              </>
            )}
          </button>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <StatPill
              icon="🔥"
              value={habit.currentStreak}
              label="Streak"
              highlight={habit.currentStreak > 0}
            />
            <StatPill icon="🏆" value={habit.longestStreak} label="Best" />
            <StatPill icon="📊" value={habit.totalCompletions} label="Total" />
          </div>
        </div>
      </div>

      {showEdit && <HabitForm habit={habit} onClose={() => setShowEdit(false)} />}
      {showDelete && (
        <DeleteModal
          habitId={habit.id}
          habitName={habit.name}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  )
}

function StatPill({
  icon,
  value,
  label,
  highlight,
}: {
  icon: string
  value: number
  label: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-base">{icon}</span>
      <span
        className={`text-sm font-bold ${highlight ? 'text-orange-500' : 'text-slate-700'}`}
      >
        {value}
      </span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}
