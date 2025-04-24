const express = require('express');
const router = express.Router();
const { supabase } = require('../config');
const { authAdmin } = require('../middleware/auth');

// Airdrop haberleri API (public olanlar)
router.get('/airdrops', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('airdrops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Airdrop listesi hatası:', err);
    res.status(500).json({ error: 'Airdrop verileri alınamadı' });
  }
});

// Yetkilendirme gerektiren işlemler
router.post('/airdrops', authAdmin, async (req, res) => {
  try {
    const { title, description, link, image_url } = req.body;
    
    if (!title || !description || !link) {
      return res.status(400).json({ error: 'Başlık, açıklama ve link zorunludur' });
    }
    
    const { data, error } = await supabase
      .from('airdrops')
      .insert([
        { title, description, link, image_url, created_at: new Date() }
      ]);
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Airdrop ekleme hatası:', err);
    res.status(500).json({ error: 'Airdrop eklenirken bir hata oluştu' });
  }
});

router.delete('/airdrops/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('airdrops')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Airdrop silme hatası:', err);
    res.status(500).json({ error: 'Airdrop silinirken bir hata oluştu' });
  }
});

// Haberler API (public olanlar)
router.get('/news', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Haber listesi hatası:', err);
    res.status(500).json({ error: 'Haber verileri alınamadı' });
  }
});

// Yetkilendirme gerektiren işlemler
router.post('/news', authAdmin, async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Başlık ve içerik zorunludur' });
    }
    
    const { data, error } = await supabase
      .from('news')
      .insert([
        { title, content, image_url, created_at: new Date() }
      ]);
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Haber ekleme hatası:', err);
    res.status(500).json({ error: 'Haber eklenirken bir hata oluştu' });
  }
});

router.delete('/news/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Haber silme hatası:', err);
    res.status(500).json({ error: 'Haber silinirken bir hata oluştu' });
  }
});

// Referanslar (Partner Borsalar) API (public olanlar)
router.get('/referrals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Referans listesi hatası:', err);
    res.status(500).json({ error: 'Referans verileri alınamadı' });
  }
});

// Yetkilendirme gerektiren işlemler
router.post('/referrals', authAdmin, async (req, res) => {
  try {
    const { platform_name, description, link } = req.body;
    
    if (!platform_name || !link) {
      return res.status(400).json({ error: 'Platform adı ve link zorunludur' });
    }
    
    const { data, error } = await supabase
      .from('referrals')
      .insert([
        { platform_name, description, link, created_at: new Date() }
      ]);
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Referans ekleme hatası:', err);
    res.status(500).json({ error: 'Referans eklenirken bir hata oluştu' });
  }
});

router.delete('/referrals/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Referans silme hatası:', err);
    res.status(500).json({ error: 'Referans silinirken bir hata oluştu' });
  }
});

// Admin yetkilendirme gerektiren istatistikler
router.get('/statistics', authAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    const stats = {
      totalUsers: data.length,
      activeUsers: data.filter(user => {
        const lastActivity = new Date(user.last_activity);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return lastActivity >= oneWeekAgo;
      }).length
    };
    
    res.json(stats);
  } catch (err) {
    console.error('İstatistik hatası:', err);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
});

// Admin yetkilendirme işlemleri
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email ve şifre zorunludur' });
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Admin rolüne sahip mi kontrol et
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (adminError || !adminData) {
      return res.status(403).json({ error: 'Yetkisiz erişim' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Giriş hatası:', err);
    res.status(401).json({ error: 'Giriş başarısız' });
  }
});

router.post('/auth/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (err) {
    console.error('Çıkış hatası:', err);
    res.status(500).json({ error: 'Çıkış yapılırken bir hata oluştu' });
  }
});

module.exports = router; 