-- ============================================================
-- TinyHabit Seed Data (SQL version)
-- For a TypeScript seed script, use: npm run seed
--
-- To run manually, replace 'YOUR_USER_UUID' with a real user
-- UUID from Supabase Dashboard → Authentication → Users
-- ============================================================

DO $$
DECLARE
  uid         UUID := 'YOUR_USER_UUID'::UUID;
  h1 UUID := gen_random_uuid();
  h2 UUID := gen_random_uuid();
  h3 UUID := gen_random_uuid();
  h4 UUID := gen_random_uuid();
  h5 UUID := gen_random_uuid();
BEGIN

INSERT INTO habits (id, user_id, name, emoji, color) VALUES
  (h1, uid, 'Morning Run',   '🏃', '#6366f1'),
  (h2, uid, 'Read 30 min',   '📚', '#8b5cf6'),
  (h3, uid, 'Meditate',      '🧘', '#22c55e'),
  (h4, uid, 'Drink Water',   '💧', '#3b82f6'),
  (h5, uid, 'No Sugar',      '🍎', '#f97316');

-- Habit 1: strong streak (last 14 days)
INSERT INTO habit_logs (habit_id, user_id, completed_date)
SELECT h1, uid, CURRENT_DATE - i
FROM generate_series(0, 13) AS s(i);

-- Habit 2: streak of 7, broken, then 3 days
INSERT INTO habit_logs (habit_id, user_id, completed_date)
SELECT h2, uid, CURRENT_DATE - i FROM generate_series(0, 2) AS s(i)
UNION ALL
SELECT h2, uid, CURRENT_DATE - i FROM generate_series(5, 11) AS s(i);

-- Habit 3: every other day this month
INSERT INTO habit_logs (habit_id, user_id, completed_date)
SELECT h3, uid, CURRENT_DATE - i
FROM generate_series(0, 29) AS s(i)
WHERE i % 2 = 0;

-- Habit 4: just started (last 3 days)
INSERT INTO habit_logs (habit_id, user_id, completed_date)
SELECT h4, uid, CURRENT_DATE - i
FROM generate_series(0, 2) AS s(i);

-- Habit 5: marked complete most days but skipped yesterday
INSERT INTO habit_logs (habit_id, user_id, completed_date)
VALUES (h5, uid, CURRENT_DATE);
INSERT INTO habit_logs (habit_id, user_id, completed_date)
SELECT h5, uid, CURRENT_DATE - i
FROM generate_series(2, 20) AS s(i)
WHERE i % 3 != 0;

END $$;
