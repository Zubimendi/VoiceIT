// utils/index.js
/**
 * Helper function to validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Helper function to sanitize user input to prevent XSS attacks
   * @param {string} input - The input to sanitize
   * @returns {string} - Sanitized input
   */
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  /**
   * Helper function to paginate results
   * @param {Array} items - The array of items to paginate
   * @param {number} page - The current page number
   * @param {number} limit - The number of items per page
   * @returns {Object} - Object containing paginated data and pagination info
   */
  const paginate = (items, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);
    const totalPages = Math.ceil(items.length / limit);
    
    return {
      data: paginatedItems,
      pagination: {
        total: items.length,
        page,
        limit,
        pages: totalPages
      }
    };
  };
  
  module.exports = {
    isValidEmail,
    sanitizeInput,
    paginate
  };