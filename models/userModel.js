const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Initialize database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )`,
      (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        }
      }
    );
  }
});

// Create a new user
const createUser = (email, password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) return callback(err);
        callback(null, this.lastID);
      }
    );
  });
};

// Find a user by email
const findUserByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};

// Find a user by ID
const findUserById = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
