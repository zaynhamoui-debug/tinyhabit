export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4">🌱</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">No habits yet</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
        Add your first habit to start tracking your daily progress and building streaks.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <span>+</span> Add Your First Habit
      </button>
    </div>
  )
}
