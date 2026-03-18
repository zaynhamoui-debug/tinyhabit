import { signOut } from '@/actions/auth'
import Link from 'next/link'

export default function Navbar({ email }: { email: string }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm">
            ✦
          </span>
          TinyHabit
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block truncate max-w-[200px]">
            {email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
