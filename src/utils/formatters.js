/**
 * src/utils/formatters.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Utility Formatters
 * A collection of pure helper functions for data formatting.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/**
 * Format a price (in cents) to a human-readable currency string.
 * @param {number} cents       – Amount in cents (e.g. 1550 = $15.50)
 * @param {string} [currency]  – ISO 4217 code (default: 'USD')
 * @param {string} [locale]    – BCP 47 locale (default: 'en-US')
 * @returns {string}
 */
function formatCurrency(cents, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

/**
 * Format a Unix timestamp (ms) into a readable date string.
 * @param {number} ts   – Unix timestamp in milliseconds
 * @param {string} [locale]
 * @returns {string}
 */
function formatDate(ts, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(ts));
}

/**
 * Format a distance in metres to a km or m string.
 * @param {number} metres
 * @returns {string}
 */
function formatDistance(metres) {
  if (metres >= 1000) return `${(metres / 1000).toFixed(1)} km`;
  return `${Math.round(metres)} m`;
}

/**
 * Format duration in seconds to "Xh Ym" or "Zm" string.
 * @param {number} seconds
 * @returns {string}
 */
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Capitalise the first letter of every word in a string.
 * @param {string} str
 * @returns {string}
 */
function titleCase(str) {
  return String(str).replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Mask an email address for privacy display.
 * e.g.  "jay@example.com"  →  "j**@example.com"
 * @param {string} email
 * @returns {string}
 */
function maskEmail(email) {
  const [local, domain] = email.split('@');
  const masked = local[0] + '*'.repeat(Math.max(local.length - 1, 2));
  return `${masked}@${domain}`;
}

/**
 * Truncate a string to maxLen chars, appending an ellipsis.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(str, maxLen = 50) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

module.exports = { formatCurrency, formatDate, formatDistance, formatDuration, titleCase, maskEmail, truncate };
