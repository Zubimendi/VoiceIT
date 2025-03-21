// models/signature.model.js
const { pool } = require('../config/database');

const Signature = {
  // Create a new signature (vote)
  create: async (petitionId, userId, comment = null) => {
    try {
      const [result] = await pool.query(
        'INSERT INTO signatures (petition_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())',
        [petitionId, userId, comment]
      );
      return result.insertId;
    } catch (error) {
      // Handle duplicate signature error (user already signed)
      if (error.code === 'ER_DUP_ENTRY') {
        return null;
      }
      throw error;
    }
  },

  // Check if a user has signed a petition
  hasUserSigned: async (petitionId, userId) => {
    const [rows] = await pool.query(
      'SELECT 1 FROM signatures WHERE petition_id = ? AND user_id = ?',
      [petitionId, userId]
    );
    return rows.length > 0;
  },

  // Get signatures for a petition
  findByPetitionId: async (petitionId, limit = 50, offset = 0) => {
    const [rows] = await pool.query(`
      SELECT s.*, u.username
      FROM signatures s
      JOIN users u ON s.user_id = u.id
      WHERE s.petition_id = ?
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `, [petitionId, limit, offset]);
    
    return rows;
  },

  // Delete a signature
  delete: async (petitionId, userId) => {
    const [result] = await pool.query(
      'DELETE FROM signatures WHERE petition_id = ? AND user_id = ?',
      [petitionId, userId]
    );
    return result.affectedRows > 0;
  },

  // Count signatures for a petition
  countByPetitionId: async (petitionId) => {
    const [result] = await pool.query(
      'SELECT COUNT(*) as total FROM signatures WHERE petition_id = ?',
      [petitionId]
    );
    return result[0].total;
  }
};

module.exports = Signature;