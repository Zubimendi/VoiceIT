// controllers/admin.controller.js
const User = require('../models/user.model');
const Petition = require('../models/petition.model');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database'); // Ensure this line is present

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const users = await User.findAll(limit, offset);
    const total = await User.count();

    console.log("ALL USERS", users)
    
    res.status(200).json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    delete user.password;
    
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = await User.create(username, email, hashedPassword, isAdmin ? 1 : 0);
    
    res.status(201).json({
      message: 'User created successfully',
      userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow blocking of admin users (including self)
    if (user.is_admin) {
      return res.status(403).json({ message: 'Cannot block admin users' });
    }
    
    await User.toggleBlock(userId, true);
    
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.toggleBlock(userId, false);
    
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    
    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    await Petition.delete(petitionId);
    
    res.status(200).json({ message: 'Petition deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.count();
    
    // Get total petitions
    const totalPetitions = await Petition.count();
    
    // Get recent petitions (last 5)
    const recentPetitions = await Petition.findAll(5, 0);
    
    res.status(200).json({
      totalUsers,
      totalPetitions,
      recentPetitions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete user from the database
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};