'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createHabit, updateHabit } from '@/actions/habits'
import { Habit, HabitFormState, PRESET_COLORS } from '@/lib/types'

interface Props {
  habit?: Habit
  onClose: () => void
}

export default function HabitForm({ habit, onClose }: Props) {
  const action = habit
    ? (updateHabit.bind(null, habit.id) as (
        prevState: HabitFormState,
        formData: FormData
      ) => Promise<HabitFormState>)
    : createHabit

  const [state, formAction, isPending] = useActionState(action, {})
  const colorRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">
            {habit ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          {state.error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {state.error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Habit name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={habit?.name ?? ''}
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
              placeholder="e.g. Morning Run"
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Emoji <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              name="emoji"
              type="text"
              maxLength={10}
              defaultValue={habit?.emoji ?? ''}
              className="w-24 px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors text-center"
              placeholder="🏃"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
            <input type="hidden" name="color" ref={colorRef} defaultValue={habit?.color ?? PRESET_COLORS[0]} />
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    if (colorRef.current) colorRef.current.value = color
                    // visually update selection
                    document.querySelectorAll('[data-color-swatch]').forEach((el) => {
                      const btn = el as HTMLElement
                      btn.style.outline = btn.dataset.colorSwatch === color ? `2px solid ${color}` : 'none'
                      btn.style.outlineOffset = '2px'
                    })
                  }}
                  data-color-swatch={color}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: (habit?.color ?? PRESET_COLORS[0]) === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? 'Saving…' : habit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
