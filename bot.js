require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// Bot oluşturulması - production'da webhook kullan, development'ta polling
const isDevelopment = !process.env.VERCEL_URL;
let bot;

// Güvenli bot başlatma
try {
  bot = new TelegramBot(token, { polling: isDevelopment });
  console.log('Bot instance created successfully');
} catch (error) {
  console.error('Error creating bot instance:', error);
  // Fallback bot oluştur
  bot = new TelegramBot(token, { polling: false });
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

// Diğer mesajlara yanıt (polling modundayken)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Sadece /start dışındaki mesajları ve callback query olmayanları yakala (polling için)
  if (isDevelopment && !msg.text?.match(/^\/start/) && !msg.callback_query) {
    bot.sendMessage(chatId, 'Anlaşılmadı. Lütfen menüden bir seçenek seçin veya /start yazarak başlangıç menüsüne dönün.');
  }
});

// Webhook'u ayarlama fonksiyonu
const setupWebhook = (app) => {
  if (!isDevelopment) {
    try {
      // Vercel URL kontrolü
      if (!process.env.VERCEL_URL) {
        console.error('VERCEL_URL çevre değişkeni tanımlanmamış!');
        console.log('Webhook ayarlanamadı. Lütfen Vercel proje ayarlarında VERCEL_URL çevre değişkenini tanımlayın.');
        return;
      }
      
      const url = `https://${process.env.VERCEL_URL}`;
      const webhookPath = `/api/webhook/${token}`;
      const fullWebhookUrl = `${url}${webhookPath}`;
      
      console.log(`Webhook URL'si ayarlanıyor: ${fullWebhookUrl}`);
      
      bot.setWebHook(fullWebhookUrl)
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
            return res.sendStatus(200); // Telegram expects 200 OK even for errors
          }
          
          console.log('Update verisi:', JSON.stringify(update).slice(0, 200) + '...');
          
          // Mesajı doğrudan işle - bu yaklaşım daha güvenilir
          bot.processUpdate(update);
          
          console.log('Webhook isteği başarıyla işlendi');
          return res.sendStatus(200);
        } catch (error) {
          console.error('Webhook isteği işlenirken hata oluştu:', error);
          return res.sendStatus(200); // Telegram expects 200 OK even for errors
        }
      });

      // Webhook bilgilerini kontrol etme endpoint'i
      app.get('/api/webhook/status', (req, res) => {
        bot.getWebHookInfo()
          .then(info => {
            res.json({ status: 'success', webhookInfo: info });
          })
          .catch(error => {
            res.json({ status: 'error', error: error.message });
          });
      });
    } catch (error) {
      console.error('Webhook ayarlanırken hata oluştu:', error);
    }
  } else {
    console.log("Bot polling modunda çalışıyor.");
    
    // Hata ayıklama için fazladan log ekle
    bot.on('polling_error', (error) => {
      console.error('Polling hatası:', error);
    });
  }
};

// Bot instance'ını ve webhook ayarlama fonksiyonunu export et
module.exports = {
  bot,
  setupWebhook
}; 