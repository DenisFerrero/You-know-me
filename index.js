// Load env variables from .env file
require('dotenv').config();
// Default value assignment
process.env.TELEGRAM_POLL_OPTIONS_LIMIT ??= 10;

const database = require('./helpers/database');