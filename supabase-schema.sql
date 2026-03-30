-- =============================================
-- SubSharePool — Supabase Database Schema v2
-- Run this in your Supabase SQL editor
-- =============================================

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  image text,
  role text default 'user' check (role in ('user', 'admin')),
  blocked boolean default false,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  icon text default '📦',
  icon_bg text default '#F5F4EF',
  name text not null,
  description text,
  price numeric,
  total_slots int default 2,
  filled_slots int default 0,
  category text default 'other',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('carpool','hotel','flight','buddy')),
  from_location text not null,
  to_location text not null,
  date text not null,
  total_seats int default 2,
  filled_seats int default 0,
  price text,
  description text,
  vehicle text,
  created_at timestamptz default now()
);

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  handle text,
  type text not null,
  description text,
  url text not null,
  stat text,
  created_at timestamptz default now()
);

create table if not exists feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  body text not null,
  tag text not null check (tag in ('deal','idea','question','collab')),
  likes int default 0,
  link_title text,
  link_url text,
  created_at timestamptz default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  published boolean default false,
  author_id uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references users(id) on delete cascade,
  receiver_id uuid references users(id) on delete cascade,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table trips enable row level security;
alter table links enable row level security;
alter table feed_posts enable row level security;
alter table blog_posts enable row level security;
alter table messages enable row level security;

-- Policies
create policy "Public read users" on users for select using (true);
create policy "Public read subs" on subscriptions for select using (true);
create policy "Public read trips" on trips for select using (true);
create policy "Public read links" on links for select using (true);
create policy "Public read feed" on feed_posts for select using (true);
create policy "Public read blogs" on blog_posts for select using (published = true);
create policy "Message participants" on messages for select using (sender_id::text = auth.uid()::text or receiver_id::text = auth.uid()::text);

-- Make yourself admin after first login:
-- update users set role = 'admin' where email = 'your@email.com';
