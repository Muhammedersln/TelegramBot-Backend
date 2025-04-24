require('dotenv').config();

module.exports = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || 'BOT_TOKEN_BURAYA',
  port: process.env.PORT || 3001
}; 