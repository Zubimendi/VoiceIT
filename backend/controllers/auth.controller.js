// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, 0)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Check if account is blocked
    if (user.is_blocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Valid password", isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    console.log("NEW TOKEN", process.env.JWT_EXPIRATION)
    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: !!user.is_admin,
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};