const bcrypt = require('bcryptjs');
const pool = require('../db');

module.exports = {
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  create: async (nama, email, password) => {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)',
      [nama, email, hash]
    );
    return { id: result.insertId, nama, email, password: hash };
  },

  update: async (id, data) => {
    if (data.nama) {
      await pool.query('UPDATE users SET nama = ? WHERE id = ?', [data.nama, id]);
    }
  },

  verifyPassword: async (plain, hash) => bcrypt.compare(plain, hash),

  safeUser: (user) => ({ id: user.id, nama: user.nama, email: user.email }),
};
