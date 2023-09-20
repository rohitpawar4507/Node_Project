const db = require('../config/db');

// Create a new user
function createUser(username, hashedPassword, firstName, lastName, email) {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO users (username, password, firstName, lastName, email) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, firstName, lastName, email],
      (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve(result);
      }
    );
  });
}

// Find a user by username
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve(result[0] || null);
      }
    );
  });
}

module.exports = {
  createUser,
  findUserByUsername,
};
