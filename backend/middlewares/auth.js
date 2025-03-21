// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Check if user exists and is not blocked
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    console.log('User query result:', users);

    if (users.length === 0) {
      console.log('User not found');
      return res.status(403).json({ message: 'User not found' });
    }

    if (users[0].is_blocked) {
      console.log('User is blocked');
      return res.status(403).json({ message: 'User is blocked' });
    }

    req.userId = decoded.id;
    req.isAdmin = !!decoded.isAdmin;
    console.log('TOKEN', process.env.JWT_EXPIRATION)
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyToken;