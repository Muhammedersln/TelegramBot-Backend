require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

// Bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// Bot oluşturulması
const isDevelopment = !process.env.VERCEL_URL;
const bot = new TelegramBot(token, { webHook: !isDevelopment });

// Webhook ayarları
if (!isDevelopment) {
  const url = `https://${process.env.VERCEL_URL}`;
  bot.setWebHook(`${url}/webhook/${token}`);
}

// Webhook endpoint'i
app.post(`/webhook/${token}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Health check endpoint'i
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Express sunucusunu başlat
const PORT = process.env.PORT || 3000;
if (isDevelopment) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Mock veri - Airdroplar ve borsalar
const airdropData = [
  { name: 'KSHA Token', description: 'Yeni kripto para airdrop fırsatı', link: 'https://example.com/ksha-airdrop' },
  { name: 'BLUM Token', description: 'Blum ekosistem token airdrop', link: 'https://example.com/blum-airdrop' },
  { name: 'NFT Airdrop', description: 'Özel koleksiyon NFT airdrop', link: 'https://example.com/nft-airdrop' }
];

const exchangeData = [
  { name: 'Binance', description: 'En büyük kripto para borsası', link: 'https://binance.com' },
  { name: 'KuCoin', description: 'Popüler altcoin borsası', link: 'https://kucoin.com' },
  { name: 'Gate.io', description: 'Yeni projeler için borsa', link: 'https://gate.io' }
];

// Karşılama mesajı
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `🎉 Kusha Kripto Bot'a Hoşgeldin !

⚪ Botun Özellikleri

🟡 Bot ile güncel kripto para Airdrop (Halka Arz) takip edebilirsin. Bu sayede gelir elde edebilirsin.
🟡 İndirimli komisyon avantajı ve ödüllerle kripto para borsalarına kayıt olabilirsin.

Kolaylıklar ✨`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🟡 AirDrop (Kripto Halka Arz)', callback_data: 'airdrop' }],
        [{ text: '🟡 Partner Borsalar Kayıt Linkleri', callback_data: 'partner_borsalar' }],
        [{ text: '🔵 Kusha Airdrop Kazanç Kanalı', url: 'https://t.me/kushaairdropkanal' }],
        [{ text: '🔵 Kusha Airdrop Twitter', url: 'https://twitter.com/kushaairdrop' }],
        [{ text: '🟢 BlumAutoClicker', callback_data: 'blum_auto_clicker' }],
        [{ text: '⚪ KushaAutoClicker', callback_data: 'kusha_auto_clicker' }],
        [{ text: '⚫ KOD AL', callback_data: 'kod_al' }]
      ]
    }
  });
});

// AirDrop menüsü
bot.onText(/🟡 AirDrop \(Kripto Halka Arz\)/, (msg) => {
  const chatId = msg.chat.id;
  
  let message = '🚀 *Güncel Airdrop Fırsatları*\n\n';
  
  airdropData.forEach((airdrop, index) => {
    message += `*${index + 1}. ${airdrop.name}*\n`;
    message += `Açıklama: ${airdrop.description}\n`;
    message += `Link: ${airdrop.link}\n\n`;
  });
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Partner Borsalar menüsü
bot.onText(/🟡 Partner Borsalar Kayıt Linkleri/, (msg) => {
  const chatId = msg.chat.id;
  
  let message = '💹 *Partner Kripto Para Borsaları*\n\n';
  
  exchangeData.forEach((exchange, index) => {
    message += `*${index + 1}. ${exchange.name}*\n`;
    message += `Açıklama: ${exchange.description}\n`;
    message += `Kayıt Link: ${exchange.link}\n\n`;
  });
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

// Kusha Airdrop Kazanç Kanalı
bot.onText(/🔵 Kusha Airdrop Kazanç Kanalı/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Airdrop kazanç kanalımıza katılın: https://t.me/kushaairdropkanal');
});

// Kusha Airdrop Twitter
bot.onText(/🔵 Kusha Airdrop Twitter/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Twitter hesabımızı takip edin: https://twitter.com/kushaairdrop');
});

// BlumAutoClicker
bot.onText(/🟢 BlumAutoClicker/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'BlumAutoClicker uygulaması hakkında bilgi: Kripto airdrop etkinliklerinde otomatik tıklama için tasarlanmış yardımcı araç.');
});

// KushaAutoClicker
bot.onText(/⚪ KushaAutoClicker/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'KushaAutoClicker uygulaması hakkında bilgi: Airdrop ve bounty görevleri için özel olarak tasarlanmış tıklama aracı.');
});

// KOD AL
bot.onText(/⚫ KOD AL/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Referans kodunuz: KUSHA2024\nBu kodu borsalara kayıt olurken kullanabilirsiniz.');
});

// Callback sorguları için işleyici ekleme
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
  switch (data) {
    case 'airdrop':
      let airdropMessage = '🚀 *Güncel Airdrop Fırsatları*\n\n';
  
      airdropData.forEach((airdrop, index) => {
        airdropMessage += `*${index + 1}. ${airdrop.name}*\n`;
        airdropMessage += `Açıklama: ${airdrop.description}\n`;
        airdropMessage += `Link: ${airdrop.link}\n\n`;
      });
  
      bot.sendMessage(chatId, airdropMessage, { parse_mode: 'Markdown' });
      break;
      
    case 'partner_borsalar':
      let exchangeMessage = '💹 *Partner Kripto Para Borsaları*\n\n';
  
      exchangeData.forEach((exchange, index) => {
        exchangeMessage += `*${index + 1}. ${exchange.name}*\n`;
        exchangeMessage += `Açıklama: ${exchange.description}\n`;
        exchangeMessage += `Kayıt Link: ${exchange.link}\n\n`;
      });
  
      bot.sendMessage(chatId, exchangeMessage, { parse_mode: 'Markdown' });
      break;
      
    case 'blum_auto_clicker':
      bot.sendMessage(chatId, 'BlumAutoClicker uygulaması hakkında bilgi: Kripto airdrop etkinliklerinde otomatik tıklama için tasarlanmış yardımcı araç.');
      break;
      
    case 'kusha_auto_clicker':
      bot.sendMessage(chatId, 'KushaAutoClicker uygulaması hakkında bilgi: Airdrop ve bounty görevleri için özel olarak tasarlanmış tıklama aracı.');
      break;
      
    case 'kod_al':
      bot.sendMessage(chatId, 'Referans kodunuz: KUSHA2024\nBu kodu borsalara kayıt olurken kullanabilirsiniz.');
      break;
  }
  
  // Bildirim kapatma
  bot.answerCallbackQuery(callbackQuery.id);
});

// Diğer mesajlara yanıt
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Önceden tanımlanmış komutlar dışındaki mesajlar için
  if (!msg.text || !msg.text.match(/^\/start/)) {
    bot.sendMessage(chatId, 'Anlaşılmadı. Lütfen menüden bir seçenek seçin veya /start yazarak başlangıç menüsüne dönün.');
  }
});

// Export Express app
module.exports = app; 