const sqlite3 = require('sqlite3')

if (process.env.VERBOSE) {
  sqlite3.verbose();
}

const db = new sqlite3.Database(':memory:');

// INIT DATABASE

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, active INTEGER);');

module.exports = {
  /**
   * Subscribe user to the poll
   * @param {string} username Username to add
   * @returns {boolean} Whatever the user has been inserted or not
   */
  async subscribe (username) {
    const result = await new Promise(function (resolve, reject) {
      db.get('SELECT COUNT(id) AS count FROM users WHERE active = 1;', [], function (err, row) {
        if (err) return reject(err);
        else return resolve(row.count);
      })
    });
    // If there are less users active than the limit
    if (result < process.env.TELEGRAM_POLL_OPTIONS_LIMIT) {
      return await new Promise(function (resolve, reject) {
        db.get('SELECT id FROM users WHERE username = ? LIMIT 1;', username, function (err, row) {
          if (err) return reject(err);
          // Set the user active if already exists
          if (id !== null) {
            db.run('UPDATE users SET active = 1 WHERE id = ?', id, function (_err) {
              if (err) return reject(err);
              return resolve(true);
            });
          }
          // Create the user if not exists
          else {
            db.run('INSERT INTO users (username, active) VALUES (?, 1)', username, function (_err) {
              if (err) return reject(err);
              return resolve(true);
            });
          }
        })
      });
    }
    else return false;
  },
  /**
   * Unsubscribe user to the poll
   * @param {string} username
   * @returns {boolean} Whatever the user has been unsubscribed or not
   */
  async unsubscribe (username) {
    return await new Promise (function (resolve, reject) {
      db.run('UPDATE users SET active = 0 WHERE username = ?', username, function (_err) {
        if (err) return reject(err);
        return resolve(true);
      });
    })
  }
}
