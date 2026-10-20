import crypto from 'crypto';

/**
 * Validates password complexity:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Computes cryptographically secure salted hash using PBKDF2 with SHA-512
 * 100,000 iterations to resist GPU-based brute-force attacks.
 */
export function hashPassword(password: string, saltInput?: string): { salt: string; hash: string } {
  const salt = saltInput || crypto.randomBytes(16).toString('hex');
  const hashBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return {
    salt,
    hash: hashBuffer.toString('hex'),
  };
}

/**
 * Timing-safe password verification to eliminate timing side-channel attacks
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  if (!password || !salt || !storedHash) return false;
  const hashBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (hashBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, storedBuffer);
}

/**
 * Generates an unguessable 256-bit cryptographically secure session token
 */
export function generateSessionToken(): string {
  return 'tl_sec_' + crypto.randomBytes(32).toString('hex');
}
