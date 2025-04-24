-- Users tablosu (Telegram kullanıcıları)
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Airdrop tablosu
CREATE TABLE IF NOT EXISTS public.airdrops (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Haberler tablosu
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Referral (Partner Borsalar) tablosu
CREATE TABLE IF NOT EXISTS public.referrals (
  id BIGSERIAL PRIMARY KEY,
  platform_name TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS (Row Level Security) Politikaları

-- Airdrops tablosu için RLS
ALTER TABLE public.airdrops ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Airdrops are viewable by everyone" 
  ON public.airdrops FOR SELECT 
  USING (true);

-- Sadece admin ekleyebilir, güncelleyebilir ve silebilir
CREATE POLICY "Airdrops can be inserted by admins" 
  ON public.airdrops FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Airdrops can be updated by admins" 
  ON public.airdrops FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Airdrops can be deleted by admins" 
  ON public.airdrops FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

-- News tablosu için RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "News are viewable by everyone" 
  ON public.news FOR SELECT 
  USING (true);

-- Sadece admin ekleyebilir, güncelleyebilir ve silebilir
CREATE POLICY "News can be inserted by admins" 
  ON public.news FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "News can be updated by admins" 
  ON public.news FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "News can be deleted by admins" 
  ON public.news FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

-- Referrals tablosu için RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Referrals are viewable by everyone" 
  ON public.referrals FOR SELECT 
  USING (true);

-- Sadece admin ekleyebilir, güncelleyebilir ve silebilir
CREATE POLICY "Referrals can be inserted by admins" 
  ON public.referrals FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Referrals can be updated by admins" 
  ON public.referrals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Referrals can be deleted by admins" 
  ON public.referrals FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

-- Users tablosu için RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Adminler okuyabilir
CREATE POLICY "Users are viewable by admins" 
  ON public.users FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ));

-- Users ilgili servis tarafından (JWT ile) güncellenebilir
CREATE POLICY "Users can be updated by service" 
  ON public.users FOR UPDATE
  USING (true); -- Servis JWT veya API key ile çalışacak, bu yüzden şimdilik açık

-- Admin_users tablosu için RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Adminler sadece kendi bilgilerini görebilir
CREATE POLICY "Admin users can view their own data" 
  ON public.admin_users FOR SELECT 
  USING (user_id = auth.uid()); 