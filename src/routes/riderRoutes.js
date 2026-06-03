/**
 * src/routes/riderRoutes.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Express Router for Rider Endpoints
 * Defines all /riders RESTful routes.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const express = require('express');
const router  = express.Router();

// ── In-memory store (replace with DB in production) ───────────────
let riders = [
  { id: 'r001', name: 'Jay Gohil',    email: 'jay@riderapp.com',   status: 'active',   vehicleType: 'bicycle',    rating: 4.8, totalRides: 132 },
  { id: 'r002', name: 'Priya Sharma', email: 'priya@riderapp.com', status: 'active',   vehicleType: 'scooter',    rating: 4.6, totalRides:  87 },
  { id: 'r003', name: 'Arjun Mehta',  email: 'arjun@riderapp.com', status: 'inactive', vehicleType: 'motorcycle', rating: 4.2, totalRides:  54 },
];

// ── GET /riders – list all riders ─────────────────────────────────
router.get('/', (req, res) => {
  const { status, vehicleType } = req.query;
  let result = [...riders];

  if (status)      result = result.filter(r => r.status === status);
  if (vehicleType) result = result.filter(r => r.vehicleType === vehicleType);

  res.json({ success: true, count: result.length, data: result });
});

// ── GET /riders/:id – single rider ────────────────────────────────
router.get('/:id', (req, res) => {
  const rider = riders.find(r => r.id === req.params.id);
  if (!rider) return res.status(404).json({ success: false, message: 'Rider not found.' });
  res.json({ success: true, data: rider });
});

// ── POST /riders – create rider ───────────────────────────────────
router.post('/', (req, res) => {
  const { name, email, vehicleType } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'name and email are required.' });
  }

  const newRider = {
    id:          `r${Date.now()}`,
    name:        name.trim(),
    email:       email.toLowerCase().trim(),
    status:      'pending',
    vehicleType: vehicleType || 'bicycle',
    rating:      0,
    totalRides:  0,
  };

  riders.push(newRider);
  res.status(201).json({ success: true, data: newRider });
});

// ── PATCH /riders/:id – update rider ─────────────────────────────
router.patch('/:id', (req, res) => {
  const idx = riders.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Rider not found.' });

  const allowed = ['name', 'email', 'status', 'vehicleType', 'rating'];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) riders[idx][key] = req.body[key];
  });

  res.json({ success: true, data: riders[idx] });
});

// ── DELETE /riders/:id – remove rider ─────────────────────────────
router.delete('/:id', (req, res) => {
  const len = riders.length;
  riders = riders.filter(r => r.id !== req.params.id);
  if (riders.length === len) {
    return res.status(404).json({ success: false, message: 'Rider not found.' });
  }
  res.json({ success: true, message: 'Rider deleted.' });
});

module.exports = router;
