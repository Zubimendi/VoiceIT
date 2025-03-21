// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User signup
router.post('/signup', authController.signup);

// User login
router.post('/login', authController.login);

module.exports = router;