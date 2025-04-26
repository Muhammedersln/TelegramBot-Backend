require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Bot token
const token = process.env.TELEGRAM_BOT_TOKEN || '7861575530:AAFenotTwpAqjLoEFalw3vDBkDrZq8Vse8A';

// Botun çalışma modunu belirle - polling moduna geçiyoruz
const isDevelopment = process.env.NODE_ENV !== 'production';
const usePolling = true; // Polling'i aktif et

let bot;

// Güvenli bot başlatma
try {
  if (usePolling) {
    console.log('Bot polling modunda başlatılıyor...');
    bot = new TelegramBot(token, { polling: true });
    console.log('Bot polling modunda başarıyla başlatıldı');
    
    // Polling hatalarını yakala
    bot.on('polling_error', (error) => {
      console.error('Polling hatası:', error);
    });
  } else {
    console.log('Bot webhook modunda başlatılıyor...');
    bot = new TelegramBot(token, { polling: false });
    console.log('Bot webhook modunda başarıyla başlatıldı');
  }
} catch (error) {
  console.error('Bot örneği oluşturulurken hata:', error);
  // Fallback bot oluştur
  bot = new TelegramBot(token, { polling: true });
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

// Webhook'u ayarlama fonksiyonu
const setupWebhook = (app, force = false) => {
  if (!usePolling || force) {
    try {
      // Vercel URL'yi doğrudan belirt
      const vercelUrl = process.env.VERCEL_URL || 'telegram-bot-backend-coral.vercel.app';
      
      const url = `https://${vercelUrl}`;
      const webhookPath = `/api/webhook/${token}`;
      const fullWebhookUrl = `${url}${webhookPath}`;
      
      console.log(`Webhook URL'si ayarlanıyor: ${fullWebhookUrl}`);
      
      // Webhook'u temizle ve yeniden ayarla
      bot.deleteWebHook()
        .then(() => {
          console.log('Eski webhook temizlendi');
          return bot.setWebHook(fullWebhookUrl);
        })
        .then(() => {
          console.log(`Webhook başarıyla ayarlandı: ${fullWebhookUrl}`);
        })
        .catch(error => {
          console.error('Webhook ayarlanırken hata oluştu:', error);
        });
      
      // Gelen webhook isteklerini işle
      app.post(webhookPath, (req, res) => {
        console.log('Webhook isteği alındı');
        
        try {
          // Telegram API'den gelen update verisinin yapısını kontrol et
          const update = req.body;
          
          if (!update) {
            console.error('Boş update alındı');
            return res.sendStatus(200);
          }
          
          console.log('Update verisi alındı');
          
          // Mesajı doğrudan işle
          bot.processUpdate(update);
          
          console.log('Webhook isteği başarıyla işlendi');
          return res.sendStatus(200);
        } catch (error) {
          console.error('Webhook isteği işlenirken hata oluştu:', error);
          return res.sendStatus(200);
        }
      });
      
      // Webhook durumunu kontrol etmek için endpoint
      app.get('/api/bot/webhook-status', (req, res) => {
        bot.getWebHookInfo()
          .then(info => {
            res.json({
              status: 'success',
              webhook: info,
              botUrl: fullWebhookUrl
            });
          })
          .catch(error => {
            res.status(500).json({
              status: 'error',
              error: error.message
            });
          });
      });
      
      // Botun durumunu kontrol etmek için bir endpoint
      app.get('/api/bot/status', (req, res) => {
        bot.getMe()
          .then(botInfo => {
            res.json({
              status: 'online',
              bot: {
                id: botInfo.id,
                name: botInfo.first_name,
                username: botInfo.username
              },
              mode: 'webhook',
              webhookUrl: fullWebhookUrl
            });
          })
          .catch(error => {
            res.status(500).json({
              status: 'error',
              error: error.message
            });
          });
      });
    } catch (error) {
      console.error('Webhook ayarlanırken hata oluştu:', error);
    }
  } else {
    console.log("Bot polling modunda çalışıyor, webhook ayarlanmadı.");
    
    // Durum kontrolü için endpoint
    if (app) {
      app.get('/api/bot/status', (req, res) => {
        res.json({
          status: 'online',
          mode: 'polling'
        });
      });
    }
  }
};

// Bot instance'ını ve webhook ayarlama fonksiyonunu export et
module.exports = {
  bot,
  setupWebhook
}; 