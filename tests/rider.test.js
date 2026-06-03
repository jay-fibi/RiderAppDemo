/**
 * tests/rider.test.js
 * ─────────────────────────────────────────────────────────────────
 * RiderAppDemo – Unit Tests for Rider Model
 * Tests createRider(), validateRider(), and serializeRider().
 *
 * Run with:  node tests/rider.test.js
 * (No external test framework required – uses built-in assert)
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

const assert = require('assert');
const path   = require('path');

// Resolve model relative to project root
const { createRider, validateRider, serializeRider, RIDER_STATUS, VEHICLE_TYPES } =
  require(path.join(__dirname, '../src/models/Rider'));

// ── Test helpers ──────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅  ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${description}`);
    console.error(`       → ${err.message}`);
    failed++;
  }
}

// ─────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════');
console.log('  🧪  Rider Model Unit Tests');
console.log('══════════════════════════════════════════════════════\n');

// ── createRider() ─────────────────────────────────────────────────
console.log('  createRider()');

test('returns an object with expected keys', () => {
  const r = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001' });
  ['id','name','email','phone','status','vehicleType','rating','totalRides','earnings','location','createdAt','updatedAt']
    .forEach(k => assert.ok(k in r, `Missing key: ${k}`));
});

test('trims name and lowercases email', () => {
  const r = createRider({ name: '  Jay  ', email: 'JAY@TEST.COM', phone: '555-0001' });
  assert.strictEqual(r.name, 'Jay');
  assert.strictEqual(r.email, 'jay@test.com');
});

test('defaults status to PENDING when not provided', () => {
  const r = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001' });
  assert.strictEqual(r.status, RIDER_STATUS.PENDING);
});

test('accepts valid status', () => {
  const r = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001', status: 'active' });
  assert.strictEqual(r.status, RIDER_STATUS.ACTIVE);
});

test('defaults vehicleType to bicycle for unknown type', () => {
  const r = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001', vehicleType: 'hoverboard' });
  assert.strictEqual(r.vehicleType, 'bicycle');
});

test('clamps rating between 0 and 5', () => {
  const over  = createRider({ name: 'A', email: 'a@b.com', phone: '1', rating: 10 });
  const under = createRider({ name: 'A', email: 'a@b.com', phone: '1', rating: -3 });
  assert.strictEqual(over.rating,  5);
  assert.strictEqual(under.rating, 0);
});

// ── validateRider() ───────────────────────────────────────────────
console.log('\n  validateRider()');

test('valid rider passes validation', () => {
  const r = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001' });
  const { valid, errors } = validateRider(r);
  assert.ok(valid, `Expected valid but got errors: ${errors.join(', ')}`);
});

test('missing name produces error', () => {
  const r = createRider({ email: 'jay@test.com', phone: '555-0001' });
  const { valid, errors } = validateRider(r);
  assert.ok(!valid);
  assert.ok(errors.some(e => e.includes('name')));
});

test('invalid email format produces error', () => {
  const r = createRider({ name: 'Jay', email: 'not-an-email', phone: '555' });
  r.email = 'not-an-email';  // bypass lowercase
  const { errors } = validateRider(r);
  assert.ok(errors.some(e => e.includes('email')));
});

// ── serializeRider() ──────────────────────────────────────────────
console.log('\n  serializeRider()');

test('serialized rider omits earnings and updatedAt', () => {
  const r  = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001' });
  const sr = serializeRider(r);
  assert.ok(!('earnings'  in sr), 'earnings should be stripped');
  assert.ok(!('updatedAt' in sr), 'updatedAt should be stripped');
});

test('serialized rider contains public fields', () => {
  const r  = createRider({ name: 'Jay', email: 'jay@test.com', phone: '555-0001' });
  const sr = serializeRider(r);
  ['id','name','email','status','vehicleType','rating'].forEach(k =>
    assert.ok(k in sr, `Missing public field: ${k}`)
  );
});

// ── Constants ─────────────────────────────────────────────────────
console.log('\n  Constants');

test('RIDER_STATUS contains required values', () => {
  ['ACTIVE','INACTIVE','SUSPENDED','PENDING'].forEach(k =>
    assert.ok(k in RIDER_STATUS, `Missing status: ${k}`)
  );
});

test('VEHICLE_TYPES contains at least bicycle and scooter', () => {
  assert.ok(VEHICLE_TYPES.includes('bicycle'));
  assert.ok(VEHICLE_TYPES.includes('scooter'));
});

// ── Summary ───────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('══════════════════════════════════════════════════════\n');

if (failed > 0) process.exit(1);
