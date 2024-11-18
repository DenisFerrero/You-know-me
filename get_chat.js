// Load env variables from .env file
require('dotenv').config();
const axios = require('axios');

// Validate telegram token
if (typeof process.env.TELEGRAM_TOKEN !== 'string' || process.env.TELEGRAM_TOKEN.length === 0) {
  console.error('Invalid token provided!');
  process.exit(0);
}

(async function () {
  const res = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getUpdates`);
  
  console.log('Chat id: ' + res.data.result.find(msg => msg.my_chat_member?.chat?.id != null)?.my_chat_member?.chat?.id);
})();
