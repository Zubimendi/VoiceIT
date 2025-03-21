// config/database.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'voiceit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a Promise wrapped instance of the pool
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

module.exports = {
  pool: promisePool,
  testConnection
};