# Supabase Kurulum ve Kullanım Rehberi

Bu rehber, Kusha Kripto Bot projesi için Supabase'in nasıl kurulacağını ve kullanılacağını açıklar.

## Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidip hesap oluşturun veya giriş yapın.
2. "New Project" seçeneğine tıklayarak yeni bir proje oluşturun.
3. Proje adı ve şifre belirleyin.
4. Bölge olarak size en yakın olan bölgeyi seçin.
5. "Create new project" butonuna tıklayarak projeyi oluşturun.

## Veritabanı Şemasını Oluşturma

### Manuel Yöntem:

1. Supabase Dashboard'da "SQL Editor" sekmesine tıklayın.
2. "New Query" butonuna tıklayın.
3. `migrations/20240710000000_initial_schema.sql` dosyasındaki SQL kodlarını kopyalayıp editöre yapıştırın.
4. "Run" butonuna tıklayarak SQL kodlarını çalıştırın.
5. Seed verilerini eklemek için aynı işlemi `seed.sql` dosyası ile tekrarlayın.

### Supabase CLI ile (Önerilen Yöntem):

1. [Supabase CLI](https://supabase.com/docs/guides/cli)'yi kurun:
   ```bash
   npm install -g supabase
   ```

2. Supabase CLI'yi yapılandırın:
   ```bash
   supabase login
   ```

3. Projeyi yerel olarak başlatın:
   ```bash
   supabase init
   ```

4. `migrations` ve `seed.sql` dosyalarını Supabase klasörüne kopyalayın.

5. Migrations'ları çalıştırın:
   ```bash
   supabase db push
   ```

## Admin Kullanıcısı Oluşturma

1. Supabase Dashboard'da "Authentication" > "Users" sekmesine gidin.
2. "Invite user" butonuna tıklayın.
3. E-posta adresi ve rol girin, ardından "Invite" butonuna tıklayın.
4. Kullanıcı e-postasına giden davet linkine tıklayarak şifre belirlemesini sağlayın.
5. Kullanıcı ID'sini almak için "Authentication" > "Users" bölümünden oluşturduğunuz kullanıcıya tıklayın ve UUID'yi kopyalayın.
6. SQL Editor'da aşağıdaki kodu UUID'yi değiştirerek çalıştırın:
   ```sql
   INSERT INTO public.admin_users (user_id, username, role)
   VALUES ('KOPYALADIĞINIZ-UUID', 'admin', 'admin');
   ```

## API Anahtarlarını Alma

1. Supabase Dashboard'da "Project Settings" > "API" sekmesine gidin.
2. "Project URL" ve "Project API keys" bölümlerinden "anon" public key'i kopyalayın.
3. Bu bilgileri `.env` dosyalarınıza ekleyin:

   Backend için:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

   Frontend için:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Supabase Güvenlik Ayarları

1. RLS (Row Level Security) politikaları migration dosyasında tanımlanmıştır. Bu politikalar, verilere kimlerin erişebileceğini belirler.
2. Ek güvenlik için, Supabase Dashboard'da "Authentication" > "Policies" sekmesinden politikaları gözden geçirin ve gerekirse düzenleyin.

## Sorun Giderme

### Yaygın Sorunlar:

1. **Yetkilendirme Hataları**:
   - Doğru API anahtarlarını kullandığınızdan emin olun.
   - Admin kullanıcısının `admin_users` tablosunda kaydının olduğunu kontrol edin.

2. **RLS Politikaları ile İlgili Sorunlar**:
   - Supabase Dashboard'da "SQL Editor" kullanarak tablolardaki politikaları kontrol edin:
     ```sql
     SELECT * FROM pg_policies WHERE schemaname = 'public';
     ```

3. **Veritabanı Bağlantı Sorunları**:
   - Supabase projenizin aktif olduğundan emin olun.
   - API anahtarlarınızın doğru olduğunu kontrol edin.

### Test Etme:

Supabase bağlantısını test etmek için basit bir JavaScript kodu:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'SUPABASE_URL';
const supabaseKey = 'SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase.from('users').select('count');
  if (error) {
    console.error('Bağlantı hatası:', error);
  } else {
    console.log('Bağlantı başarılı, kullanıcı sayısı:', data);
  }
}

testConnection();
``` 