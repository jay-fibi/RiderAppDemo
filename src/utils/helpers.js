// src/utils/helpers.js
// Reusable utility / helper functions for the Cline Demo App

// ─── String Helpers ───────────────────────────────────────────────────────────

/**
 * Capitalise the first letter of every word in a string.
 * @param {string} str
 * @returns {string}
 */
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Truncate a string to `maxLength` characters, appending "…" if truncated.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength = 80) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

/**
 * Generate a simple random alphanumeric ID.
 * @param {number} length – default 8
 * @returns {string}
 */
function generateId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

// ─── Number Helpers ───────────────────────────────────────────────────────────

/**
 * Clamp a number between min and max (inclusive).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round a number to a given number of decimal places.
 * @param {number} value
 * @param {number} decimals – default 2
 * @returns {number}
 */
function round(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ─── Array Helpers ────────────────────────────────────────────────────────────

/**
 * Return a new array with duplicate values removed.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Shuffle an array using the Fisher-Yates algorithm (non-mutating).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/**
 * Return a human-readable "time ago" string (e.g. "3 minutes ago").
 * @param {Date|number|string} date
 * @returns {string}
 */
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: "year",   secs: 31536000 },
    { label: "month",  secs: 2592000  },
    { label: "week",   secs: 604800   },
    { label: "day",    secs: 86400    },
    { label: "hour",   secs: 3600     },
    { label: "minute", secs: 60       },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// ─── Exports (CommonJS / Node-compatible) ─────────────────────────────────────
if (typeof module !== "undefined" && module.exports) {
  module.exports = { toTitleCase, truncate, generateId, clamp, round, unique, shuffle, timeAgo };
}
