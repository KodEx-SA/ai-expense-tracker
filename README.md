# Spendly — AI Expense Tracker

A dark-luxury AI-powered expense tracker built with Next.js 15, Supabase, and Claude AI.

## Features
- AI Natural Language Input — describe expenses in plain English
- AI Auto-Categorization — Claude categorizes instantly
- AI Spending Insights — personalized analysis
- Budget Tracking — per-category limits with alerts
- Beautiful dark UI — Syne + DM Sans, electric emerald accents

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY
```

Run schema in Supabase SQL Editor: `supabase/schema.sql`

```bash
npm run dev
```

## Tech
Next.js 15 · Supabase · Anthropic Claude Sonnet 4 · Recharts · Tailwind CSS v4
