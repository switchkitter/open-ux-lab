-- Open UX Lab usage stats. Paste a query into Supabase: SQL Editor > New query > Run.
-- Counts are anonymous daily totals (see public.usage_counts in schema.sql).

-- Visits per day, last 30 days
select day, count as visits
from public.usage_counts
where event = 'visit' and day > current_date - 30
order by day desc;

-- Lesson completion rate (all time): how many openings end in a completed lesson
select key as lesson,
       sum(count) filter (where event = 'lesson_opened') as opened,
       sum(count) filter (where event = 'lesson_completed') as completed,
       round(100.0 * sum(count) filter (where event = 'lesson_completed')
             / nullif(sum(count) filter (where event = 'lesson_opened'), 0)) as completion_pct
from public.usage_counts
where event in ('lesson_opened', 'lesson_completed')
group by key
order by completion_pct nulls last;

-- Hardest exercises: highest share of wrong answers (at least 10 answers)
select key as exercise,
       sum(count) filter (where event = 'exercise_wrong') as wrong,
       sum(count) filter (where event = 'exercise_right') as "right",
       round(100.0 * sum(count) filter (where event = 'exercise_wrong') / sum(count)) as wrong_pct
from public.usage_counts
where event in ('exercise_right', 'exercise_wrong')
group by key
having sum(count) >= 10
order by wrong_pct desc
limit 20;

-- Reviews completed per week
select date_trunc('week', day)::date as week, sum(count) as reviews
from public.usage_counts
where event = 'review_completed'
group by 1
order by 1 desc;
