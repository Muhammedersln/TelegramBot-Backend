const { supabase } = require('../config');

// Admin yetkilendirme middleware'i
const authAdmin = async (req, res, next) => {
  try {
    // Authorization header'dan token al
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme token\'ı bulunamadı' });
    }
    
    // Supabase ile kullanıcı oturumunu kontrol et
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Geçersiz token' });
    }
    
    // Admin rolüne sahip olup olmadığını kontrol et
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (adminError || !adminData) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }
    
    // Kullanıcı bilgilerini request nesnesine ekle
    req.user = user;
    req.admin = adminData;
    
    next();
  } catch (err) {
    console.error('Yetkilendirme hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = {
  authAdmin
}; 