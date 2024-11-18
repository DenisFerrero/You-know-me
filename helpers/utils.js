// Load env variables from .env file
require('dotenv').config();
const validator = require('cron-validator');
const questions = require('./questions/index');

process.env.POLL_EXPIRE = isNaN(parseInt(process.env.POLL_EXPIRE)) ? null : parseInt(process.env.POLL_EXPIRE);

process.env.TELEGRAM_POLL_OPEN_TIME = isNaN(parseInt(process.env.TELEGRAM_POLL_OPEN_TIME)) ? null : parseInt(process.env.TELEGRAM_POLL_OPEN_TIME);

// Default value assignment
process.env.TELEGRAM_POLL_OPTIONS_LIMIT ??= 10;
process.env.TZ ??= 'Europe/Rome'
process.env.POLL_CRON ??= '0 13,21 * * *';
// Cron pattern validator
if (!validator.isValidCron(process.env.POLL_CRON)) {
  console.error('Invalid cron provided : ' + process.env.POLL_CRON + '!');
  process.exit(0);
}
// Validate telegram token
if (typeof process.env.TELEGRAM_TOKEN !== 'string' || process.env.TELEGRAM_TOKEN.length === 0) {
  console.error('Invalid token provided!');
  process.exit(0);
}
// Validate telegram chat id
if (typeof process.env.TELEGRAM_CHAT !== 'string' || process.env.TELEGRAM_CHAT.length === 0) {
  console.error('Invalid chat id provided!');
  process.exit(0);
}
// Validate generator
process.env.GENERATOR ??= 'static';
if (!questions.modes.includes(process.env.GENERATOR)) {
  console.warn('You selected an invalid generator: "' + process.env.GENERATOR + '". Setting to default value: "static"');
  process.env.GENERATOR = 'static';
}

// Create console.verbose method
console.verbose = function (...msg) {
  if (process.env.VERBOSE === 'true') {
    console.log(...msg);
  }
}

module.exports = {
  /**
   * Get the date on which the next poll will expire, if the variable TELEGRAM_POLL_OPEN_TIME is not provided the filter will not be applied
   * @returns {Date|null} DateTime of expire or null 
   */
  getPollExpire () {
    if (!isNaN(parseInt(process.env.TELEGRAM_POLL_OPEN_TIME))) {
      return new Date(new Date().getTime() + parseInt(process.env.TELEGRAM_POLL_OPEN_TIME))
    } else {
      return null;
    }
  },
  /**
   * Generate a question using provided GENERATOR from env variables
   * @returns {string} Question
   */
  getQuestion () {
    return questions.getActiveMode().getQuestion();
  }
};