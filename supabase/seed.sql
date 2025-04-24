-- NOT: Admin kullanıcısı oluşturmak için önce Supabase Authentication ile bir kullanıcı oluşturmalısınız
-- Daha sonra o kullanıcının UUID'sini aşağıdaki sorguya eklemelisiniz
-- Admin kullanıcısını oluşturmak için:
-- 1. Supabase Dashboard > Authentication > Users bölümüne gidin
-- 2. "Invite User" ile kullanıcı davet edin veya "Add User" ile kullanıcı ekleyin
-- 3. Oluşturulan kullanıcının UUID'sini alın
-- 4. Aşağıdaki sorguyu UUID ile güncelleyin

-- ÖRNEK: Admin kullanıcısı eklemek için (UUID'yi değiştirin)
-- INSERT INTO public.admin_users (user_id, username, role)
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin', 'admin');

-- Örnek airdrop verileri
INSERT INTO public.airdrops (title, description, link, image_url, created_at)
VALUES 
  ('Örnek Airdrop 1', 'Bu bir örnek airdrop açıklamasıdır.', 'https://example.com/airdrop1', 'https://example.com/images/airdrop1.jpg', now()),
  ('Örnek Airdrop 2', 'Bu bir başka örnek airdrop açıklamasıdır.', 'https://example.com/airdrop2', 'https://example.com/images/airdrop2.jpg', now());

-- Örnek haberler
INSERT INTO public.news (title, content, image_url, created_at)
VALUES 
  ('Örnek Haber 1', 'Bu bir örnek haber içeriğidir.', 'https://example.com/images/news1.jpg', now()),
  ('Örnek Haber 2', 'Bu bir başka örnek haber içeriğidir.', 'https://example.com/images/news2.jpg', now());

-- Örnek referral (partner borsa) verileri
INSERT INTO public.referrals (platform_name, description, link, created_at)
VALUES 
  ('Örnek Borsa 1', 'Bu borsa ile %10 komisyon indirimi kazanın.', 'https://example.com/referral1', now()),
  ('Örnek Borsa 2', 'Bu borsa ile 10 USDT bonus kazanın.', 'https://example.com/referral2', now()); 