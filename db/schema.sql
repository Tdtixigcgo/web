-- Extensions
create extension if not exists "pgcrypto";

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  usage text not null,
  price numeric(12,2) not null check (price >= 0),
  image_url text,
  category_id uuid not null references public.categories(id) on delete restrict,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_featured_idx on public.products(featured);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();


-- admin_users
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

-- admin_access_requests
create table if not exists public.admin_access_requests (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  device_name text not null,
  browser_info text not null,
  requested_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  approved_at timestamptz,
  approved_by text,
  email_target text not null
);

create index if not exists admin_access_requests_device_id_idx on public.admin_access_requests(device_id);
create index if not exists admin_access_requests_status_idx on public.admin_access_requests(status);

-- approved_devices
create table if not exists public.approved_devices (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  approved boolean not null default false,
  approved_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

-- storage bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Basic RLS setup (recommend tune per project)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.admin_access_requests enable row level security;
alter table public.approved_devices enable row level security;
alter table public.admin_users enable row level security;

-- Public read for catalog
create policy if not exists "public read categories" on public.categories
for select using (true);

create policy if not exists "public read products" on public.products
for select using (true);

create policy if not exists "no public read admin users" on public.admin_users
for select using (false);

-- Admin operations should be via service role (API routes) => no broad write policies for anon/authenticated.
