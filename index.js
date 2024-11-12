// Load env variables from .env file
require('dotenv').config();
// Default value assignment
process.env.TELEGRAM_POLL_OPTIONS_LIMIT ??= 10;

console.verbose = function (...msg) {
  if (process.env.VERBOSE) {
    console.log(...msg);
  }
}

const database = require('./helpers/database');