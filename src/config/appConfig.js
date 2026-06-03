/**
 * src/config/appConfig.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Application Configuration
 * Centralises all environment-based settings with safe defaults.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const env = process.env.NODE_ENV || 'development';

const config = {
  // ── Environment ────────────────────────────────────────────────
  env,
  isDev:  env === 'development',
  isProd: env === 'production',
  isTest: env === 'test',

  // ── Server ─────────────────────────────────────────────────────
  server: {
    port:    parseInt(process.env.PORT, 10)    || 3000,
    host:    process.env.HOST                  || '0.0.0.0',
    baseUrl: process.env.BASE_URL              || 'http://localhost:3000',
  },

  // ── Database ───────────────────────────────────────────────────
  db: {
    uri:      process.env.DB_URI    || 'mongodb://localhost:27017/riderapp',
    poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
    timeoutMs: 5000,
  },

  // ── Auth / JWT ─────────────────────────────────────────────────
  auth: {
    jwtSecret:    process.env.JWT_SECRET    || 'dev_secret_change_in_prod',
    jwtExpiresIn: process.env.JWT_EXPIRES   || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
  },

  // ── External Services ──────────────────────────────────────────
  maps: {
    apiKey:    process.env.MAPS_API_KEY    || '',
    provider:  process.env.MAPS_PROVIDER  || 'google',
  },

  payments: {
    apiKey:    process.env.PAYMENT_API_KEY || '',
    provider:  process.env.PAYMENT_PROVIDER || 'stripe',
    currency:  'USD',
  },

  // ── Feature Flags ──────────────────────────────────────────────
  features: {
    surgeEnabled:       process.env.FF_SURGE       === 'true',
    ratingEnabled:      process.env.FF_RATING      !== 'false',  // on by default
    promoCodesEnabled:  process.env.FF_PROMO        === 'true',
  },

  // ── Logging ────────────────────────────────────────────────────
  log: {
    level: process.env.LOG_LEVEL || (env === 'production' ? 'warn' : 'debug'),
    pretty: env !== 'production',
  },
};

// Validate critical settings in production
if (config.isProd) {
  const required = ['JWT_SECRET', 'DB_URI', 'MAPS_API_KEY', 'PAYMENT_API_KEY'];
  const missing  = required.filter(k => !process.env[k]);
  if (missing.length) {
    throw new Error(`[Config] Missing required env vars in production: ${missing.join(', ')}`);
  }
}

module.exports = config;
