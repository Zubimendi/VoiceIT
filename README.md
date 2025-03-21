# Petition Web App

A web application that allows users to create, sign, and share petitions.

## Features

- User authentication (signup, login)
- Create and manage petitions
- Sign petitions with comments
- View all petitions with sorting and filtering
- Admin dashboard for user and petition management
- Responsive design with Bootstrap

## Tech Stack

- **Frontend**: jQuery, Bootstrap, HTML5
- **Backend**: Node.js, Express
- **Database**: MySQL (via XAMPP)
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
petition-app-backend/
│
├── config/
│   └── database.js       # Database connection configuration
│
├── controllers/
│   ├── auth.controller.js       # Authentication logic
│   ├── petition.controller.js   # Petition management
│   └── admin.controller.js      # Admin functionality
│
├── middlewares/
│   ├── auth.js           # Authentication middleware
│   └── admin.js          # Admin role verification
│
├── models/
│   ├── user.model.js     # User data operations
│   ├── petition.model.js # Petition data operations
│   └── signature.model.js # Signature data operations
│
├── routes/
│   ├── auth.routes.js    # Authentication routes
│   ├── petition.routes.js # Petition routes
│   └── admin.routes.js   # Admin routes
│
├── utils/
│   └── index.js          # Utility functions
│
├── public/               # Static files (frontend)
│
├── .env                  # Environment variables
├── server.js             # Entry point
└── package.json          # Project dependencies
```

## Setup Instructions

### Prerequisites

1. Node.js and npm installed
2. XAMPP installed (for MySQL)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd petition-app-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start XAMPP and ensure MySQL service is running

4. Create the database:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `petition_app`
   - Import the SQL schema from `database-schema.sql` or run the SQL commands directly

5. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Update the database credentials if necessary

6. Start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```

7. The server will run on http://localhost:3000 by default

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Petitions

- `GET /api/petitions` - Get all petitions
- `GET /api/petitions/:id` - Get a specific petition
- `POST /api/petitions` - Create a new petition (auth required)
- `PUT /api/petitions/:id` - Update a petition (auth required)
- `DELETE /api/petitions/:id` - Delete a petition (auth required)
- `POST /api/petitions/:id/sign` - Sign a petition (auth required)
- `GET /api/petitions/:id/signatures` - Get signatures for a petition
- `DELETE /api/petitions/:id/sign` - Remove signature (auth required)
- `GET /api/petitions/search` - Search petitions
- `GET /api/petitions/user/me` - Get current user's petitions (auth required)

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get a specific user (admin only)
- `POST /api/admin/users` - Create a new user (admin only)
- `PUT /api/admin/users/:id/block` - Block a user (admin only)
- `PUT /api/admin/users/:id/unblock` - Unblock a user (admin only)
- `DELETE /api/admin/petitions/:id` - Delete a petition (admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)

## Default Admin User

Username: admin
Email: admin@example.com
Password: admin123