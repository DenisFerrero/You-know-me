const database = require('./helpers/database');
const TelegramBot = require('node-telegram-bot-api');
const { CronJob } = require('cron');
const _ = require('lodash')
const utils = require('./helpers/utils');

//#region Bot message handler

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.setMyCommands(JSON.stringify([
  { command: 'join', description: 'Join the poll' },
  { command: 'leave', description: 'Leave the poll' },
  { command: 'list', description: 'Show the active users in the poll' },
  { command: 'generate_question', description: 'Generate a question in this chat' }
]));

bot.onText(/\/start/, async (msg) => {
  const username = msg.from.username ?? msg.from.first_name;
  await bot.sendMessage(msg.chat.id, `${username} welcome to Know Your Name bot! Choose your command from the list below`);
})

// Add user to the poll
bot.onText(/\/join/, async (msg) => {
  const chat = await bot.sendMessage(msg.chat.id, 'Who want to join?', { reply_markup: { force_reply: true } });

  bot.onReplyToMessage(msg.chat.id, chat.message_id, async (nameMsg) => {
    const username = nameMsg.text;
    const res = await database.subscribe(username);
    if (!res) {
      await bot.sendMessage(msg.chat.id, 'Something went wrong when trying to join the poll!');
      return;
    }
    
    await bot.sendMessage(msg.chat.id, `${username} has joined the poll!`);
    console.log(`User added: ${username}`);
  });
});

// Remove user from the poll
bot.onText(/\/leave/, async (msg) => {
  const chat = await bot.sendMessage(msg.chat.id, 'Who want to leave?', { reply_markup: { force_reply: true } });

  bot.onReplyToMessage(msg.chat.id, chat.message_id, async (nameMsg) => {
    const username = nameMsg.text;
    const res = await database.unsubscribe(username);
  
    if (!res) {
      await bot.sendMessage(msg.chat.id, 'Something went wrong when trying to leave the poll!');
      return;
    }
    
    await bot.sendMessage(msg.chat.id, `${username} left the poll!`);
    console.log(`User removed: ${username}`);
  });
});

// List the users in the poll
bot.onText(/\/list/, async (msg) => {
  const users = await database.list();
  if (users.length > 0) {
    await bot.sendMessage(msg.chat.id, `This is the list of users subscribed to the poll: ${users.map(user => `\n- ${user}`)}`);
  } else {
    await bot.sendMessage(msg.chat.id, 'At the moment there is not any user in the poll :(');
  }
});

// Generate random question. [DEBUG usage]
bot.onText(/\/generate_question/, async (msg) => {
  const question = await utils.getQuestion();

  if (!question) {
    bot.sendMessage(msg.chat.id, 'Something went wrong when trying to generate a question');
    return;
  }

  bot.sendMessage(msg.chat.id, 'Generated question: ' + question);
})

// #endregion

//#region Cron poll creator

const job = CronJob.from({
  cronTime: process.env.POLL_CRON,
  onTick: async function () {
    const users = await database.list();

    if (users.length < 2) {
      console.verbose('Cannot create a poll if there are less than 2 subscribed');
      return;
    }

    const question = await utils.getQuestion();

    const subUsers = _.chunk(users, 10);
    const dateClose = utils.getPollExpire();

    for (const [index, sub] of subUsers.entries()) {
      // Create first poll with question
      if (index === 0) {
        await bot.sendPoll(process.env.TELEGRAM_CHAT, question, sub, {
          is_anonymous: false,
          close_date: dateClose
        });
      } 
      // Create the other polls concatenated to the first one
      else {
        await bot.sendPoll(process.env.TELEGRAM_CHAT, '...', sub, {
          is_anonymous: false,
          close_date: dateClose
        });
      }
    }
  },
  start: true,
  timeZone: process.env.TZ
})

//#endregion

console.log('Bot started successfully!');