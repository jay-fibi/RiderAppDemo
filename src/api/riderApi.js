/**
 * src/api/riderApi.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Rider API Client
 * Provides fetch-based helpers to communicate with the Rider backend.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const BASE_URL = process.env.API_BASE_URL || 'https://api.riderapp.example.com/v1';

/**
 * Generic request helper with error handling.
 * @param {string} endpoint
 * @param {object} options  – fetch options
 * @returns {Promise<object>}
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaults = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
  };
  const config = { ...defaults, ...options };
  delete config.token;

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    console.error(`[RiderAPI] ${options.method || 'GET'} ${endpoint} failed:`, err.message);
    throw err;
  }
}

// ── Rider Endpoints ──────────────────────────────────────────────

/**
 * Fetch all available riders.
 * @param {string} token – auth token
 * @returns {Promise<object[]>}
 */
const getRiders = (token) => request('/riders', { token });

/**
 * Fetch a single rider by ID.
 * @param {string} riderId
 * @param {string} token
 * @returns {Promise<object>}
 */
const getRiderById = (riderId, token) => request(`/riders/${riderId}`, { token });

/**
 * Create a new rider profile.
 * @param {object} riderData
 * @param {string} token
 * @returns {Promise<object>}
 */
const createRider = (riderData, token) =>
  request('/riders', { method: 'POST', body: JSON.stringify(riderData), token });

/**
 * Update an existing rider profile.
 * @param {string} riderId
 * @param {object} updates
 * @param {string} token
 * @returns {Promise<object>}
 */
const updateRider = (riderId, updates, token) =>
  request(`/riders/${riderId}`, { method: 'PUT', body: JSON.stringify(updates), token });

/**
 * Delete a rider profile.
 * @param {string} riderId
 * @param {string} token
 * @returns {Promise<object>}
 */
const deleteRider = (riderId, token) =>
  request(`/riders/${riderId}`, { method: 'DELETE', token });

module.exports = { getRiders, getRiderById, createRider, updateRider, deleteRider };
