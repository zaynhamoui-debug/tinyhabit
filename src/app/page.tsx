import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white text-2xl mb-6 shadow-lg">
          ✦
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">TinyHabit</h1>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          Build tiny habits, one day at a time.
          <br />
          Track progress, build streaks, stay consistent.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-slate-500">
          {[
            { icon: '✓', label: 'Track daily habits' },
            { icon: '🔥', label: 'Build streaks' },
            { icon: '📊', label: 'See progress' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
