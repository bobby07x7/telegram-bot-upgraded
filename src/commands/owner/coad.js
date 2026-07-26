const fs = require('fs');
const path = require('path');
const logger = require('../../core/logger');


const CODES_PATH = path.join(__dirname, '..', '..', 'storage', 'codes.json');

function loadCodes() {
  if (!fs.existsSync(CODES_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CODES_PATH, 'utf8'));
  } catch (err) {
    logger.error(`Failed to read codes.json, starting fresh: ${err.message}`);
    return {};
  }
}

function saveCodes(codes) {
  fs.writeFileSync(CODES_PATH, JSON.stringify(codes, null, 2));
}

/**
 * Creates (or overwrites) a redeem code.
 * type: 'coins' | 'item'
 * value: amount (for coins) or item id (for item — see src/database/items.js)
 * maxUses: how many different users can redeem it (default: unlimited)
 * expiresAt: timestamp in ms, or null for no expiry
 */
function createCode({ code, type, value, maxUses = null, expiresAt = null, createdBy }) {
  const codes = loadCodes();
  const key = code.trim().toUpperCase();
  codes[key] = {
    type,
    value,
    maxUses,
    uses: 0,
    redeemedBy: [],
    expiresAt,
    createdBy,
    createdAt: Date.now(),
  };
  saveCodes(codes);
  return codes[key];
}

function deleteCode(code) {
  const codes = loadCodes();
  const key = code.trim().toUpperCase();
  if (!codes[key]) return false;
  delete codes[key];
  saveCodes(codes);
  return true;
}

function listCodes() {
  return loadCodes();
}

function getCode(code) {
  const codes = loadCodes();
  return codes[code.trim().toUpperCase()] || null;
}

/**
 * Attempts to redeem a code for a user. Returns { ok: true, code } on
 * success, or { ok: false, reason } on failure — never throws, so callers
 * can just show `reason` straight to the user.
 */
function redeemCode(rawCode, userId) {
  const codes = loadCodes();
  const key = rawCode.trim().toUpperCase();
  const entry = codes[key];

  if (!entry) return { ok: false, reason: 'Invalid or expired code.' };
  if (entry.expiresAt && Date.now() > entry.expiresAt) return { ok: false, reason: 'This code has expired.' };
  if (entry.maxUses !== null && entry.uses >= entry.maxUses) return { ok: false, reason: 'This code has reached its redemption limit.' };
  if (entry.redeemedBy.includes(String(userId))) return { ok: false, reason: 'You already redeemed this code.' };

  entry.uses += 1;
  entry.redeemedBy.push(String(userId));
  saveCodes(codes);

  return { ok: true, code: entry };
}

module.exports = { createCode, deleteCode, listCodes, getCode, redeemCode };