'use client'

import { useState } from 'react'
import { HabitWithStats } from '@/lib/types'
import HabitCard from './HabitCard'
import HabitForm from './HabitForm'
import EmptyState from './EmptyState'

interface Props {
  habits: HabitWithStats[]
  today: string
}

export default function HabitGrid({ habits, today }: Props) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-900">
          My Habits{' '}
          {habits.length > 0 && (
            <span className="text-slate-400 font-normal text-sm ml-1">({habits.length})</span>
          )}
        </h2>
        {habits.length > 0 && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>+</span> Add Habit
          </button>
        )}
      </div>

      {habits.length === 0 ? (
        <EmptyState onAdd={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} today={today} />
          ))}
        </div>
      )}

      {showCreate && <HabitForm onClose={() => setShowCreate(false)} />}
    </div>
  )
}
