/**
 * src/models/Rider.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Rider Data Model
 * Defines the Rider schema, validation, and helper methods.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/** Valid rider status values */
const RIDER_STATUS = Object.freeze({
  ACTIVE:    'active',
  INACTIVE:  'inactive',
  SUSPENDED: 'suspended',
  PENDING:   'pending',
});

/** Valid vehicle types */
const VEHICLE_TYPES = Object.freeze(['bicycle', 'scooter', 'motorcycle', 'car', 'van']);

/**
 * Create a new Rider object with defaults.
 * @param {object} data  – raw rider fields
 * @returns {object}     – validated Rider record
 */
function createRider(data = {}) {
  const now = Date.now();

  return {
    id:          data.id          || `rider_${now}`,
    name:        (data.name       || '').trim(),
    email:       (data.email      || '').toLowerCase().trim(),
    phone:       (data.phone      || '').trim(),
    status:      RIDER_STATUS[String(data.status).toUpperCase()] || RIDER_STATUS.PENDING,
    vehicleType: VEHICLE_TYPES.includes(data.vehicleType) ? data.vehicleType : 'bicycle',
    rating:      typeof data.rating === 'number' ? Math.min(5, Math.max(0, data.rating)) : 0,
    totalRides:  typeof data.totalRides === 'number' ? data.totalRides : 0,
    earnings:    typeof data.earnings   === 'number' ? data.earnings   : 0,   // in cents
    location: {
      lat: data.location?.lat ?? null,
      lng: data.location?.lng ?? null,
    },
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
}

/**
 * Validate a Rider object – returns { valid, errors }.
 * @param {object} rider
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateRider(rider) {
  const errors = [];

  if (!rider.name)  errors.push('name is required');
  if (!rider.email) errors.push('email is required');
  if (rider.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rider.email)) {
    errors.push('email format is invalid');
  }
  if (!rider.phone) errors.push('phone is required');
  if (!Object.values(RIDER_STATUS).includes(rider.status)) {
    errors.push(`status must be one of: ${Object.values(RIDER_STATUS).join(', ')}`);
  }
  if (!VEHICLE_TYPES.includes(rider.vehicleType)) {
    errors.push(`vehicleType must be one of: ${VEHICLE_TYPES.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Serialize a Rider for API response (removes internal fields).
 * @param {object} rider
 * @returns {object}
 */
function serializeRider(rider) {
  const { id, name, email, phone, status, vehicleType, rating, totalRides, location, createdAt } = rider;
  return { id, name, email, phone, status, vehicleType, rating, totalRides, location, createdAt };
}

module.exports = { createRider, validateRider, serializeRider, RIDER_STATUS, VEHICLE_TYPES };
