// models/user.model.js
const { pool } = require('../config/database');

const User = {
  // Create a new user
  create: async (username, email, password, isAdmin = 0) => {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, is_admin, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, email, password, isAdmin]
    );
    return result.insertId;
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Update user information
  update: async (id, data) => {
    const { username, email } = data;
    const [result] = await pool.query(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, id]
    );
    return result.affectedRows > 0;
  },

  // Toggle block status
  toggleBlock: async (id, isBlocked) => {
    const [result] = await pool.query(
      'UPDATE users SET is_blocked = ? WHERE id = ?',
      [isBlocked ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  },

  // Update password
  updatePassword: async (id, hashedPassword) => {
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  },

  // Get all users (for admin)
  findAll: async (limit = 100, offset = 0) => {
    const [rows] = await pool.query(
      'SELECT id, username, email, is_admin, is_blocked, created_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  },

  // Count total users
  count: async () => {
    const [result] = await pool.query('SELECT COUNT(*) as total FROM users');
    return result[0].total;
  }
};

module.exports = User;