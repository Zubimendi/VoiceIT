// models/petition.model.js
const { pool } = require('../config/database');

const Petition = {
  // Create a new petition
  create: async (title, description, userId, category_id = null, image_url = null) => {
    const [result] = await pool.query(
      'INSERT INTO petitions (title, description, user_id, category_id, image_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, description, userId, category_id, image_url] // Ensure image_url is included
    );
    return result.insertId;
  },

  // Find petition by ID
  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT p.*, u.username as creator_name, 
      (SELECT COUNT(*) FROM signatures s WHERE s.petition_id = p.id) as signature_count
      FROM petitions p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  },

  // Get all petitions with pagination
  findAll: async (limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'DESC') => {
    // Validate sortBy to prevent SQL injection
    const validSortColumns = ['created_at', 'title', 'signature_count'];
    if (!validSortColumns.includes(sortBy)) {
      sortBy = 'created_at';
    }
    
    // Validate sortOrder
    sortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    const [rows] = await pool.query(`
      SELECT p.*, u.username as creator_name, 
      (SELECT COUNT(*) FROM signatures s WHERE s.petition_id = p.id) as signature_count
      FROM petitions p
      JOIN users u ON p.user_id = u.id
      ${sortBy === 'signature_count' ? 
        `ORDER BY (SELECT COUNT(*) FROM signatures s WHERE s.petition_id = p.id) ${sortOrder}, p.created_at DESC` : 
        `ORDER BY p.${sortBy} ${sortOrder}`}
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    return rows;
  },

  // Get petitions by user ID
  findByUserId: async (userId, limit = 10, offset = 0) => {
    const [rows] = await pool.query(`
      SELECT p.*, 
      (SELECT COUNT(*) FROM signatures s WHERE s.petition_id = p.id) as signature_count
      FROM petitions p
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    
    return rows;
  },

  // Update petition
  update: async (id, title, description, category_id = null) => {
    const [result] = await pool.query(
      'UPDATE petitions SET title = ?, description = ?, category_id = ? WHERE id = ?',
      [title, description, category_id, id]
    );
    return result.affectedRows > 0;
  },

  // Delete petition
  delete: async (id) => {
    // First delete all signatures
    await pool.query('DELETE FROM signatures WHERE petition_id = ?', [id]);
    
    // Then delete the petition
    const [result] = await pool.query('DELETE FROM petitions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Count total petitions
  count: async () => {
    const [result] = await pool.query('SELECT COUNT(*) as total FROM petitions');
    return result[0].total;
  },

  // Search petitions
  search: async (query, limit = 10, offset = 0) => {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query(`
      SELECT p.*, u.username as creator_name, 
      (SELECT COUNT(*) FROM signatures s WHERE s.petition_id = p.id) as signature_count
      FROM petitions p
      JOIN users u ON p.user_id = u.id
      WHERE p.title LIKE ? OR p.description LIKE ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [searchTerm, searchTerm, limit, offset]);
    
    return rows;
  }
};

module.exports = Petition;