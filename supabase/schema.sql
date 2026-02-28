-- ============================================================
-- AI Expense Tracker (Spendly) - Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- EXPENSES TABLE
-- ============================================================
create table if not exists expenses (
  id          uuid        primary key default uuid_generate_v4(),
  description text        not null,
  amount      decimal(12,2) not null check (amount > 0),
  category    text        not null default 'Uncategorized',
  date        date        not null default current_date,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- BUDGETS TABLE
-- ============================================================
create table if not exists budgets (
  id            uuid         primary key default uuid_generate_v4(),
  category      text         not null unique,
  monthly_limit decimal(12,2) not null check (monthly_limit > 0),
  alert_threshold integer    not null default 80 check (alert_threshold between 1 and 100),
  created_at    timestamptz  default now(),
  updated_at    timestamptz  default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
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

create trigger update_budgets_updated_at
  before update on budgets
  for each row execute function update_updated_at_column();

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists expenses_date_idx     on expenses(date desc);
create index if not exists expenses_category_idx on expenses(category);

-- ============================================================
-- SEED DATA (optional - comment out if not needed)
-- ============================================================
insert into expenses (description, amount, category, date) values
  ('Grocery shopping at Woolworths',    850.00, 'Food & Dining',    current_date - 1),
  ('Uber ride to work',                 120.00, 'Transport',        current_date - 2),
  ('Netflix subscription',              199.00, 'Entertainment',    current_date - 3),
  ('Electricity bill',                 1200.00, 'Utilities',        current_date - 5),
  ('Lunch at Nandos',                   185.00, 'Food & Dining',    current_date - 6),
  ('Gym membership',                    650.00, 'Health & Fitness', current_date - 7),
  ('Online course - React',             499.00, 'Education',        current_date - 10),
  ('Petrol - Shell Rustenburg',         900.00, 'Transport',        current_date - 12),
  ('Coffee x5',                         225.00, 'Food & Dining',    current_date - 14),
  ('Amazon order - tech accessories',   340.00, 'Shopping',         current_date - 15)
on conflict do nothing;

insert into budgets (category, monthly_limit, alert_threshold) values
  ('Food & Dining',    3000.00, 80),
  ('Transport',        2000.00, 80),
  ('Entertainment',     500.00, 90),
  ('Utilities',        2500.00, 85),
  ('Health & Fitness', 1000.00, 80),
  ('Shopping',         1500.00, 75)
on conflict (category) do nothing;
