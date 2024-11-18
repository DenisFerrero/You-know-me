const fs = require('fs');

const modes = fs
  .readdirSync('./helpers/questions')
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .map(file => file.replace('.js', ''));

module.exports = {
  modes: modes,

  getActiveMode () {
    return require('./' + process.env.GENERATOR);
  }
}; 