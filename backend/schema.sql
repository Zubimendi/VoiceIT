-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS voiceit;

-- Use the database
USE voiceit;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT 0,
  is_blocked BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (optional)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Petitions table
CREATE TABLE IF NOT EXISTS petitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255), -- New column for petition image
  user_id INT NOT NULL,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  petition_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (petition_id) REFERENCES petitions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (petition_id, user_id) -- Ensures one vote per user per petition
);

-- Social shares table (optional)
CREATE TABLE IF NOT EXISTS social_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  petition_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  share_count INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (petition_id) REFERENCES petitions(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (username, email, password, is_admin) 
VALUES ('admin', 'admin@example.com', ' $2y$10$jEpKQELN2PAb.EgluoTqge9ppXH6ody/SSagSPhV19GRYFq8eOGQi', 1);
-- Note: Password is 'admin123' (hashed)

-- Insert some sample categories
INSERT INTO categories (name, description) VALUES 
('Environment', 'Environmental issues and conservation'),
('Social Justice', 'Equality and human rights'),
('Health', 'Healthcare and wellness'),
('Education', 'Learning and educational reform'),
('Technology', 'Tech policies and digital rights');