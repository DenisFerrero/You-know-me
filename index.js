// Load env variables from .env file
require('dotenv').config();
// Default value assignment
process.env.TELEGRAM_POLL_OPTIONS_LIMIT ??= 10;

console.verbose = function (...msg) {
  if (process.env.VERBOSE === 'true') {
    console.log(...msg);
  }
}

const database = require('./helpers/database');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.setMyCommands(JSON.stringify([
  { command: 'join', description: 'Join into the poll' },
  { command: 'leave', description: 'Leave the poll' },
  { command: 'list', description: 'Show the active users in the poll' }
]));

bot.onText(/\start/, (msg) => {
  const username = msg.from.username ?? msg.from.first_name;
  bot.sendMessage(msg.chat.id, `${username} welcome to Know Your Name bot! Choose your command from the list below`);
})

// Add user to the poll
bot.onText(/\/join/, async (msg) => {
  const username = msg.from.username ?? msg.from.first_name;
  const res = await database.subscribe(username);
  
  if (!res) {
    bot.sendMessage(msg.chat.id, 'Something went wrong when trying to join the poll!');
    return;
  }
  
  bot.sendMessage(msg.chat.id, `${username} has joined the poll!`);
  console.log(`User added: ${username}`);
});

// Remove user from the poll
bot.onText(/\/leave/, async (msg) => {
  const username = msg.from.username ?? msg.from.first_name;
  const res = await database.unsubscribe(username);
  
  if (!res) {
    bot.sendMessage(msg.chat.id, 'Something went wrong when trying to leave the poll!');
    return;
  }
  
  bot.sendMessage(msg.chat.id, `${username} left the poll!`);
  console.log(`User removed: ${username}`);
});

// List the users in the poll
bot.onText(/\list/, async (msg) => {
  const users = await database.list();
  if (users.length > 0) {
    bot.sendMessage(msg.chat.id, `This is the list of users subscribed to the poll: ${users.map(user => `\n- ${user}`)}`);
  } else {
    bot.sendMessage(msg.chat.id, 'At the moment there is not any user in the poll :(');
  }
});

console.log('Bot started successfully!');