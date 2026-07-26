// health-store.js
// Simple in-memory HP tracker shared across all fight-related commands.
// Swap the Map for a real DB call later if you need HP to survive a bot restart.

const MAX_HP = 100;
const RECOVERY_TIME = 60 * 1000; // 1 minute auto-recovery after being knocked out
const HEAL_AMOUNT = 25;
const HEAL_COOLDOWN = 20 * 1000; // stops /heal spam

const users = new Map();

function getUser(id, name) {
  if (!users.has(id)) {
    users.set(id, { name, hp: MAX_HP, downedAt: null, lastHeal: 0 });
  }
  const u = users.get(id);
  u.name = name; // keep display name fresh
  return u;
}

// Call before any fight/heal action — auto-revives a knocked-out user once their timer is up
function checkRecovery(id) {
  const u = users.get(id);
  if (!u || u.hp > 0 || !u.downedAt) return { recovered: false };

  const elapsed = Date.now() - u.downedAt;
  if (elapsed >= RECOVERY_TIME) {
    u.hp = MAX_HP;
    u.downedAt = null;
    return { recovered: true };
  }
  return { recovered: false, remainingMs: RECOVERY_TIME - elapsed };
}

function heal(id) {
  const u = users.get(id);
  if (u.hp <= 0) return { ok: false, reason: 'downed' };

  const now = Date.now();
  if (now - u.lastHeal < HEAL_COOLDOWN) {
    return { ok: false, reason: 'cooldown', remainingMs: HEAL_COOLDOWN - (now - u.lastHeal) };
  }
  u.hp = Math.min(MAX_HP, u.hp + HEAL_AMOUNT);
  u.lastHeal = now;
  return { ok: true, hp: u.hp };
}

module.exports = { getUser, checkRecovery, heal, MAX_HP, RECOVERY_TIME };
