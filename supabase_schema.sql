
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'seller', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." 
  on profiles for select using (true);

create policy "Users can insert their own profile." 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on profiles for update using (auth.uid() = id);

-- TRIGGER: Automatically create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid error on repeated runs during dev
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SELLER APPLICATIONS TABLE
create table seller_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  business_name text not null,
  business_description text,
  whatsapp_number text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table seller_applications enable row level security;

-- Policies for Applications
create policy "Users can view their own applications" 
  on seller_applications for select using (auth.uid() = user_id);

create policy "Users can submit applications" 
  on seller_applications for insert with check (auth.uid() = user_id);

create policy "Admins can view all applications" 
  on seller_applications for select 
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update applications"
  on seller_applications for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- BANNERS / ANNOUNCEMENTS TABLE
create table banners (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text,
  link_url text,
  is_active boolean default false,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table banners enable row level security;

create policy "Everyone can view active banners"
  on banners for select using (is_active = true);

create policy "Admins can manage banners"
  on banners for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- PRODUCTS TABLE
create table products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) not null,
  name text not null,
  description text,
  price numeric not null,
  currency text default '₦',
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

create policy "Products are viewable by everyone"
  on products for select using (true);

create policy "Sellers can insert their own products"
  on products for insert with check (auth.uid() = seller_id);

create policy "Sellers can update their own products"
  on products for update using (auth.uid() = seller_id);

create policy "Sellers can delete their own products"
  on products for delete using (auth.uid() = seller_id);
