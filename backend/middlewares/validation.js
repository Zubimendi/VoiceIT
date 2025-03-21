// middlewares/validation.js
const { isValidEmail } = require('../utils');

/**
 * Validates user registration data
 */
const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  // Check if all required fields are present
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Validate username
  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ message: 'Username must be between 3 and 50 characters' });
  }
  
  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Validate password
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

/**
 * Validates petition data
 */
const validatePetition = (req, res, next) => {
  const { title, description } = req.body;
  
  // Check if all required fields are present
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  
  // Validate title
  if (title.length < 5 || title.length > 255) {
    return res.status(400).json({ message: 'Title must be between 5 and 255 characters' });
  }
  
  // Validate description
  if (description.length < 20) {
    return res.status(400).json({ message: 'Description must be at least 20 characters' });
  }
  
  next();
};

module.exports = {
  validateUserRegistration,
  validatePetition
};