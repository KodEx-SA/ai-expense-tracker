-- ============================================================
-- AI Expense Tracker - Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- EXPENSES TABLE
-- ============================================================
create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  amount decimal(12, 2) not null check (amount > 0),
  category text not null default 'Uncategorized',
  date date not null default current_date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_expenses_updated_at
  before update on expenses
  for each row execute function update_updated_at_column();

-- ============================================================
-- BUDGETS TABLE
-- ============================================================
create table if not exists budgets (
  id uuid primary key default uuid_generate_v4(),
  category text not null unique,
  monthly_limit decimal(12, 2) not null check (monthly_limit > 0),
  alert_threshold integer not null default 80 check (alert_threshold between 1 and 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_budgets_updated_at
  before update on budgets
  for each row execute function update_updated_at_column();

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists expenses_date_idx on expenses(date desc);
create index if not exists expenses_category_idx on expenses(category);

-- ============================================================
-- ROW LEVEL SECURITY (optional - enable if using auth)
-- ============================================================
-- alter table expenses enable row level security;
-- alter table budgets enable row level security;

-- ============================================================
-- SEED DATA (optional - remove if not needed)
-- ============================================================
insert into expenses (description, amount, category, date, notes) values
  ('Grocery shopping at Woolworths', 850.00, 'Food & Dining', current_date - interval '1 day', null),
  ('Uber ride to work', 120.00, 'Transport', current_date - interval '2 days', null),
  ('Netflix subscription', 199.00, 'Entertainment', current_date - interval '3 days', null),
  ('Electricity bill', 1200.00, 'Utilities', current_date - interval '5 days', null),
  ('Lunch at Nandos', 185.00, 'Food & Dining', current_date - interval '6 days', null),
  ('Gym membership', 650.00, 'Health & Fitness', current_date - interval '7 days', null),
  ('Online course', 499.00, 'Education', current_date - interval '10 days', null),
  ('Petrol', 900.00, 'Transport', current_date - interval '12 days', null),
  ('Coffee x5', 225.00, 'Food & Dining', current_date - interval '14 days', null),
  ('Amazon order', 340.00, 'Shopping', current_date - interval '15 days', null)
on conflict do nothing;

insert into budgets (category, monthly_limit, alert_threshold) values
  ('Food & Dining', 3000.00, 80),
  ('Transport', 2000.00, 80),
  ('Entertainment', 500.00, 90),
  ('Utilities', 2500.00, 85),
  ('Health & Fitness', 1000.00, 80),
  ('Shopping', 1500.00, 75)
on conflict (category) do nothing;