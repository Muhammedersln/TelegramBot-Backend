const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const { setupWebhook } = require('./bot');

// Express uygulaması oluştur
const app = express();

// CORS ve JSON middleware'leri (webhook öncesi)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser - büyük request'ler için limit arttırıldı
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Webhook pathlerini log'la (debug için)
app.use((req, res, next) => {
  console.log('İstek alındı:', req.method, req.path);
  
  // Bot isteklerini öncelikli olarak işle
  if (req.path.includes('/api/webhook/')) {
    console.log('Bot webhook isteği alındı');
  }
  
  next();
});

// API status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ercenk bot backend çalışıyor' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ercenk bot backend çalışıyor' });
});

// Özel endpoint webhook kurulumu için
app.get('/api/setup-webhook', (req, res) => {
  try {
    setupWebhook(app, true); // force parameter
    res.json({ status: 'success', message: 'Webhook kurulum işlemi başlatıldı' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Bot için webhook'u ayarla
setupWebhook(app);

// Mock verileri API endpoint'leri
// Airdrop verileri API endpoint'i
app.get('/api/airdrops', (req, res) => {
  const airdropData = [
    { id: 1, name: 'KSHA Token', description: 'Yeni kripto para airdrop fırsatı', link: 'https://example.com/ksha-airdrop' },
    { id: 2, name: 'BLUM Token', description: 'Blum ekosistem token airdrop', link: 'https://example.com/blum-airdrop' },
    { id: 3, name: 'NFT Airdrop', description: 'Özel koleksiyon NFT airdrop', link: 'https://example.com/nft-airdrop' }
  ];
  
  res.json(airdropData);
});

// Borsa verileri API endpoint'i
app.get('/api/exchanges', (req, res) => {
  const exchangeData = [
    { id: 1, name: 'Binance', description: 'En büyük kripto para borsası', link: 'https://binance.com' },
    { id: 2, name: 'KuCoin', description: 'Popüler altcoin borsası', link: 'https://kucoin.com' },
    { id: 3, name: 'Gate.io', description: 'Yeni projeler için borsa', link: 'https://gate.io' }
  ];
  
  res.json(exchangeData);
});

// 404 handler - en sonda olmalı
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Sunucuyu başlat (development ortamında)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
  });
}

// Vercel için app'i export et
module.exports = app; 