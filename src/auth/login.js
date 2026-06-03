/**
 * src/auth/login.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Authentication Module
 * Handles rider login, token generation, and session management.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const MOCK_USERS = [
  { id: 'r001', email: 'jay@riderapp.com',   password: 'hashed_pw_1', name: 'Jay Gohil',   role: 'rider' },
  { id: 'r002', email: 'admin@riderapp.com', password: 'hashed_pw_2', name: 'App Admin',   role: 'admin' },
];

/**
 * Simulate token generation (in production use JWT).
 * @param {object} user
 * @returns {string}
 */
function generateToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, ts: Date.now() })).toString('base64');
  return `mock_token.${payload}`;
}

/**
 * Login a rider by email + password.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, token?: string, user?: object, error?: string }}
 */
function login(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const user = MOCK_USERS.find(u => u.email === email);
  if (!user) {
    return { success: false, error: 'No account found with that email.' };
  }

  // Simulated password check (use bcrypt in production)
  const passwordValid = password.length > 0;
  if (!passwordValid) {
    return { success: false, error: 'Incorrect password.' };
  }

  const token = generateToken(user);
  console.log(`[Auth] Login successful for ${user.name} (${user.role})`);
  return { success: true, token, user: { id: user.id, name: user.name, role: user.role } };
}

/**
 * Logout – invalidate the session token.
 * @param {string} token
 * @returns {{ success: boolean, message: string }}
 */
function logout(token) {
  if (!token) return { success: false, message: 'No token provided.' };
  // In production: add token to a blacklist / remove from Redis
  console.log(`[Auth] Token invalidated: ${token.slice(0, 20)}…`);
  return { success: true, message: 'Logged out successfully.' };
}

module.exports = { login, logout, generateToken };
