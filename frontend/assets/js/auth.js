/**
 * Authentication Module for Petition Web App
 * Handles user login, signup, and session management with backend API
 */

/**
 * Login function - authenticates user with provided credentials
 * @param {string} emailOrUsername - User's email or username
 * @param {string} password - User's password
 * @returns {Promise<object>} - User data and authentication status
 */
async function login(emailOrUsername, password) {
    // Form validation
    if (!emailOrUsername || !password) {
        return { success: false, message: "Please enter all required fields" };
    }

    try {
        // Make request to backend API
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailOrUsername, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token); // Ensure token is stored
            localStorage.setItem('currentUser', JSON.stringify(result.user));
        }

        if (!response.ok) {
            return { success: false, message: result.message || "Login failed" };
        }


        return { 
            success: true, 
            message: "Login successful", 
            user: result,
            isAdmin: result.isAdmin
        };
    } catch (error) {
        return { success: false, message: "An error occurred during login" };
    }
}

/**
 * Signup function - registers a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} confirmPassword - Password confirmation
 * @param {string} fullName - User's full name
 * @returns {Promise<object>} - Registration status and message
 */
async function signup(email, password, confirmPassword, fullName) {
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

    try {
        // Make request to backend API
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, fullName })
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, message: result.message || "Signup failed" };
        }

        // Auto-login after signup
        localStorage.setItem('currentUser', JSON.stringify(result));

        return { 
            success: true, 
            message: "Account created successfully", 
            user: result
        };
    } catch (error) {
        return { success: false, message: "An error occurred during signup" };
    }
}

/**
 * Logout function - clears user session
 */
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); // Remove token
    window.location.href = 'index.html';
}

/**
 * Check if user is logged in
 * @returns {boolean} - Login status
 */
function isLoggedIn() {
    return !!localStorage.getItem('token'); // Check if token exists
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
    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        
        const emailOrUsername = $('#loginEmail').val();
        const password = $('#loginPassword').val();
        
        const result = await login(emailOrUsername, password);
        
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
    $('#signupForm').on('submit', async function(e) {
        e.preventDefault();
        
        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();
        const confirmPassword = $('#signupConfirmPassword').val();
        const fullName = $('#signupFullName').val();
        
        const result = await signup(email, password, confirmPassword, fullName);
        
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