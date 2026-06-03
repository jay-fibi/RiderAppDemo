/**
 * src/middleware/authMiddleware.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Authentication Middleware
 * Validates Bearer tokens on protected Express routes.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const PUBLIC_ROUTES = [
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/register' },
  { method: 'GET',  path: '/health' },
];

/**
 * Parse and verify a mock Bearer token.
 * In production replace this with jwt.verify().
 * @param {string} token
 * @returns {{ id: string, role: string, ts: number } | null}
 */
function verifyToken(token) {
  try {
    if (!token || !token.startsWith('mock_token.')) return null;
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    // Token expires after 7 days
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.ts > SEVEN_DAYS) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if the incoming request matches a public (unauthenticated) route.
 * @param {import('express').Request} req
 * @returns {boolean}
 */
function isPublicRoute(req) {
  return PUBLIC_ROUTES.some(
    r => r.method === req.method && req.path.startsWith(r.path)
  );
}

/**
 * Express middleware – enforces JWT authentication.
 * Attaches `req.user` on success.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function authMiddleware(req, res, next) {
  // Skip auth for public routes
  if (isPublicRoute(req)) return next();

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token missing.' });
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  req.user = decoded;
  next();
}

/**
 * Role-guard factory – returns middleware that allows only specified roles.
 * @param {...string} roles
 * @returns {import('express').RequestHandler}
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}.`,
      });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole, verifyToken };
