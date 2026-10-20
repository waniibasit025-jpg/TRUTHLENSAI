import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateSessionToken,
} from './auth.ts';

test('validatePasswordStrength enforces security rules', () => {
  const weak = validatePasswordStrength('abc');
  assert.equal(weak.valid, false);
  assert.ok(weak.errors.length >= 2);

  const missingUpper = validatePasswordStrength('password123');
  assert.equal(missingUpper.valid, false);
  assert.ok(missingUpper.errors.some(e => e.includes('uppercase')));

  const missingNum = validatePasswordStrength('PasswordLong');
  assert.equal(missingNum.valid, false);
  assert.ok(missingNum.errors.some(e => e.includes('number')));

  const strong = validatePasswordStrength('TruthLens@2026Secure');
  assert.equal(strong.valid, true);
  assert.equal(strong.errors.length, 0);
});

test('hashPassword generates unique salts and verifies correctly', () => {
  const pass = 'SuperSecret123!';
  const { salt, hash } = hashPassword(pass);

  assert.ok(salt.length >= 32);
  assert.ok(hash.length >= 64);

  // Correct password verification
  assert.equal(verifyPassword(pass, salt, hash), true);

  // Wrong password rejected
  assert.equal(verifyPassword('WrongPass123!', salt, hash), false);

  // Different salts produce different hashes for same password
  const second = hashPassword(pass);
  assert.notEqual(salt, second.salt);
  assert.notEqual(hash, second.hash);
});

test('generateSessionToken produces 256-bit secure hex strings', () => {
  const t1 = generateSessionToken();
  const t2 = generateSessionToken();

  assert.ok(t1.startsWith('tl_sec_'));
  assert.ok(t1.length >= 64);
  assert.notEqual(t1, t2);
});
