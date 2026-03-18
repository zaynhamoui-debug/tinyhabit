/**
 * TinyHabit seed script
 * Usage: npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 * and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_EMAIL = 'demo@tinyhabit.app'
const DEMO_PASSWORD = 'demo123456'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

async function seed() {
  console.log('🌱 Seeding TinyHabit...\n')

  // 1. Create or fetch demo user
  console.log(`Creating demo user: ${DEMO_EMAIL}`)
  const { data: createData, error: createError } = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  })

  let userId: string
  if (createError?.message?.includes('already been registered')) {
    const { data: listData } = await admin.auth.admin.listUsers()
    const existing = listData?.users.find((u) => u.email === DEMO_EMAIL)
    if (!existing) throw new Error('Could not find existing demo user')
    userId = existing.id
    console.log(`  ↳ User already exists (${userId})`)
  } else if (createError) {
    throw createError
  } else {
    userId = createData.user!.id
    console.log(`  ↳ Created user (${userId})`)
  }

  // 2. Clear existing data for clean re-seed
  await admin.from('habits').delete().eq('user_id', userId)
  console.log('  ↳ Cleared existing habits\n')

  // 3. Create habits
  const habitsToInsert = [
    { name: 'Morning Run',  emoji: '🏃', color: '#6366f1' },
    { name: 'Read 30 min',  emoji: '📚', color: '#8b5cf6' },
    { name: 'Meditate',     emoji: '🧘', color: '#22c55e' },
    { name: 'Drink Water',  emoji: '💧', color: '#3b82f6' },
    { name: 'No Sugar',     emoji: '🍎', color: '#f97316' },
  ]

  const { data: habits, error: habitError } = await admin
    .from('habits')
    .insert(habitsToInsert.map((h) => ({ ...h, user_id: userId })))
    .select()

  if (habitError) throw habitError
  console.log(`Created ${habits!.length} habits`)

  const [h1, h2, h3, h4, h5] = habits!

  // 4. Create logs
  const logs: { habit_id: string; user_id: string; completed_date: string }[] = []

  // h1: solid 14-day streak
  for (let i = 0; i <= 13; i++) logs.push({ habit_id: h1.id, user_id: userId, completed_date: daysAgo(i) })

  // h2: 3-day streak, gap, then 7 days
  for (let i = 0; i <= 2; i++)  logs.push({ habit_id: h2.id, user_id: userId, completed_date: daysAgo(i) })
  for (let i = 5; i <= 11; i++) logs.push({ habit_id: h2.id, user_id: userId, completed_date: daysAgo(i) })

  // h3: every other day for past 30 days
  for (let i = 0; i <= 29; i += 2) logs.push({ habit_id: h3.id, user_id: userId, completed_date: daysAgo(i) })

  // h4: just started, last 3 days
  for (let i = 0; i <= 2; i++) logs.push({ habit_id: h4.id, user_id: userId, completed_date: daysAgo(i) })

  // h5: completed today and most of past 20 days (some gaps)
  logs.push({ habit_id: h5.id, user_id: userId, completed_date: daysAgo(0) })
  for (let i = 2; i <= 20; i++) {
    if (i % 3 !== 0) logs.push({ habit_id: h5.id, user_id: userId, completed_date: daysAgo(i) })
  }

  const { error: logError } = await admin.from('habit_logs').insert(logs)
  if (logError) throw logError
  console.log(`Created ${logs.length} habit logs\n`)

  console.log('✅ Seed complete!\n')
  console.log('Demo credentials:')
  console.log(`  Email:    ${DEMO_EMAIL}`)
  console.log(`  Password: ${DEMO_PASSWORD}`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
