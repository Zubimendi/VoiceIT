/**
 * Authentication Module for Petition Web App
 * Handles user login, signup, and session management with dummy data
 */

// Dummy users for testing
const dummyUsers = [
    { id: 1, username: "admin", email: "admin@example.com", password: "admin123", fullName: "Admin User", isAdmin: true },
    { id: 2, username: "johndoe", email: "john@example.com", password: "password123", fullName: "John Doe", isAdmin: false },
    { id: 3, username: "janedoe", email: "jane@example.com", password: "password123", fullName: "Jane Doe", isAdmin: false }
];

/**
 * Login function - authenticates user with provided credentials
 * @param {string} emailOrUsername - User's email or username
 * @param {string} password - User's password
 * @returns {object} - User data and authentication status
 */
function login(emailOrUsername, password) {
    // Form validation
    if (!emailOrUsername || !password) {
        return { success: false, message: "Please enter all required fields" };
    }

    // Find user by email or username
    const user = dummyUsers.find(user => 
        user.email === emailOrUsername || 
        user.username === emailOrUsername
    );

    // Check if user exists and password matches
    if (!user) {
        return { success: false, message: "User not found" };
    }

    if (user.password !== password) {
        return { success: false, message: "Invalid password" };
    }

    // Create session (in real app, would use JWT or sessions)
    const userData = { ...user };
    delete userData.password; // Don't include password in session
    
    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    return { 
        success: true, 
        message: "Login successful", 
        user: userData,
        isAdmin: user.isAdmin
    };
}

/**
 * Signup function - registers a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} confirmPassword - Password confirmation
 * @param {string} fullName - User's full name
 * @returns {object} - Registration status and message
 */
function signup(email, password, confirmPassword, fullName) {
    // Form validation
    if (!email || !password || !confirmPassword || !fullName) {
        return { success: false, message: "Please enter all required fields" };
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, message: "Please enter a valid email address" };
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return { success: false, message: "Passwords do not match" };
    }

    // Check if password meets requirements (min 8 chars, letters, numbers & symbols)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return { 
            success: false, 
            message: "Password must be at least 8 characters with a mix of letters, numbers & symbols" 
        };
    }

    // Check if user already exists
    const existingUser = dummyUsers.find(user => user.email === email);
    if (existingUser) {
        return { success: false, message: "Email already registered" };
    }

    // Create new user (in real app, would save to DB)
    const username = email.split('@')[0]; // Generate username from email
    const newUser = {
        id: dummyUsers.length + 1,
        username,
        email,
        password,
        fullName,
        isAdmin: false
    };

    // Add to dummy users array (simulate DB insert)
    dummyUsers.push(newUser);

    // Auto-login after signup
    const userData = { ...newUser };
    delete userData.password;
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    return { 
        success: true, 
        message: "Account created successfully", 
        user: userData
    };
}

/**
 * Logout function - clears user session
 */
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', 'false');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Check if user is logged in
 * @returns {boolean} - Login status
 */
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Get current user data
 * @returns {object|null} - User data or null if not logged in
 */
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Check if current user is admin
 * @returns {boolean} - Admin status
 */
function isAdmin() {
    const user = getCurrentUser();
    return user ? user.isAdmin : false;
}

/**
 * Initialization function - checks for existing session on page load
 * and redirects appropriately
 */
function initAuth() {
    // Check for URL parameters (for login redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const redirected = urlParams.get('redirected');
    
    if (redirected === 'true') {
        $('#loginAlert').text('Please log in to continue').show();
    }
    
    // Add event listeners for login form
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const emailOrUsername = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        
        const result = login(emailOrUsername, password);
        
        if (result.success) {
            // Check if admin and redirect accordingly
            if (result.isAdmin) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'petitions.html';
            }
        } else {
            $('#loginAlert').text(result.message).show();
        }
    });
    
    // Add event listeners for signup form
    $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();
        const confirmPassword = $('#signupConfirmPassword').val();
        const fullName = $('#signupFullName').val();
        
        const result = signup(email, password, confirmPassword, fullName);
        
        if (result.success) {
            window.location.href = 'petitions.html';
        } else {
            $('#signupAlert').text(result.message).show();
        }
    });
    
    // Add event listener for logout
    $('.logout-btn').on('click', function(e) {
        e.preventDefault();
        logout();
    });
}

// Check login status when DOM is ready
$(document).ready(function() {
    // Update UI based on login status
    if (isLoggedIn()) {
        $('.logged-out-content').hide();
        $('.logged-in-content').show();
        
        const user = getCurrentUser();
        $('.user-fullname').text(user.fullName);
        
        // Show/hide admin links
        if (isAdmin()) {
            $('.admin-only').show();
        } else {
            $('.admin-only').hide();
        }
    } else {
        $('.logged-in-content').hide();
        $('.logged-out-content').show();
        $('.admin-only').hide();
    }
    
    // Initialize auth functionality
    initAuth();
});