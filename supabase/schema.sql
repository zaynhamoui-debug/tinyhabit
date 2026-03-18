-- ============================================================
-- TinyHabit Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ------------------------------------
-- Tables
-- ------------------------------------

CREATE TABLE IF NOT EXISTS habits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  emoji       TEXT        CHECK (char_length(emoji) <= 10),
  color       TEXT        NOT NULL DEFAULT '#6366f1',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id               UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id         UUID  NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id          UUID  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date   DATE  NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (habit_id, completed_date)
);

-- ------------------------------------
-- Indexes
-- ------------------------------------

CREATE INDEX IF NOT EXISTS idx_habits_user_id          ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id     ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id      ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date         ON habit_logs(completed_date DESC);

-- ------------------------------------
-- Auto-update updated_at
-- ------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS habits_updated_at ON habits;
CREATE TRIGGER habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ------------------------------------
-- Row Level Security
-- ------------------------------------

ALTER TABLE habits     ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Habits
CREATE POLICY "habits: select own"
  ON habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habits: insert own"
  ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits: update own"
  ON habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "habits: delete own"
  ON habits FOR DELETE USING (auth.uid() = user_id);

-- Habit logs
CREATE POLICY "logs: select own"
  ON habit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "logs: insert own"
  ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logs: delete own"
  ON habit_logs FOR DELETE USING (auth.uid() = user_id);
