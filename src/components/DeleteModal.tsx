'use client'

import { useTransition } from 'react'
import { deleteHabit } from '@/actions/habits'

interface Props {
  habitId: string
  habitName: string
  onClose: () => void
}

export default function DeleteModal({ habitId, habitName, onClose }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteHabit(habitId)
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 p-6">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-xl">🗑</span>
          </div>
          <h2 className="font-semibold text-slate-900 mb-1">Delete habit?</h2>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">&ldquo;{habitName}&rdquo;</span> and all
            its history will be permanently deleted.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
