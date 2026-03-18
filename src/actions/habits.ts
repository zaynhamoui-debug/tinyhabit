'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { HabitFormState } from '@/lib/types'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return { supabase, user }
}

export async function createHabit(
  prevState: HabitFormState,
  formData: FormData
): Promise<HabitFormState> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Habit name is required.' }
  if (name.length > 100) return { error: 'Name must be 100 characters or less.' }

  const { supabase, user } = await getAuthenticatedUser()

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name,
    emoji: (formData.get('emoji') as string)?.trim() || null,
    color: (formData.get('color') as string) || '#6366f1',
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateHabit(
  id: string,
  prevState: HabitFormState,
  formData: FormData
): Promise<HabitFormState> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Habit name is required.' }
  if (name.length > 100) return { error: 'Name must be 100 characters or less.' }

  const { supabase, user } = await getAuthenticatedUser()

  const { error } = await supabase
    .from('habits')
    .update({
      name,
      emoji: (formData.get('emoji') as string)?.trim() || null,
      color: (formData.get('color') as string) || '#6366f1',
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteHabit(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser()
  await supabase.from('habits').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
}

export async function toggleHabitLog(
  habitId: string,
  date: string,
  isCompleted: boolean
): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser()

  if (isCompleted) {
    await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_date', date)
      .eq('user_id', user.id)
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: habitId,
      user_id: user.id,
      completed_date: date,
    })
  }

  revalidatePath('/dashboard')
}
