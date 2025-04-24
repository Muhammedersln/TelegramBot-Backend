const express = require('express');
const cors = require('cors');
const { port } = require('./config');
const bot = require('./bot');

// Express uygulaması oluştur
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Kusha Kripto Bot API çalışıyor' });
});

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

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
  console.log('Telegram Bot aktif');
}); 