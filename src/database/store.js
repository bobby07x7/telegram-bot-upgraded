const fs = require('fs');
const path = require('path');
const logger = require('../core/logger');

const DB_PATH = path.join(__dirname, '..', '..', 'storage', 'db.json');

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { users: {}, groups: {}, usernames: {} };
  }
  try {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (!db.usernames) db.usernames = {};
    return db;
  } catch (err) {
    logger.error(`Failed to read db.json, starting fresh: ${err.message}`);
    return { users: {}, groups: {}, usernames: {} };
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const DEFAULT_USER = () => ({
  username: null,
  firstName: null,
  balance: 0,
  bank: 0,
  xp: 0,
  level: 1,
  inventory: [],
  equipped: { weapon: null, armor: null, accessory: null },
  badges: [],
  referrals: 0,
  referredBy: null,
  lastDaily: 0,
  lastWeekly: 0,
  lastMonthly: 0,
  lastSpin: 0,
  spinsToday: 0,
  jailedUntil: 0,
  robStreak: 0,
  // Per-item forge/upgrade progress, keyed by catalog item id (see
  // core/forge.js). Shared across every copy of that item you own — items
  // aren't unique instances in this bot, so "your Iron Sword" is one shared
  // progress record, not per-copy.
  forge: {},
  // Items moved out of active inventory into long-term storage via
  // /itemstore and /itemtake (kept separate from bank /withdraw, which is
  // for currency).
  storage: [],
  // Every item id ever bought via /buy — powers /collection. Items obtained
  // only via /spin, /gift, or /grant won't appear here yet.
  collectionLog: [],
  bio: '',
  isPremium: false,
  history: [],
  settings: { notifications: true },
  createdAt: Date.now(),
});

function addHistory(id, entry) {
  const db = loadDb();
  if (!db.users[id]) db.users[id] = DEFAULT_USER();
  db.users[id].history = db.users[id].history || [];
  db.users[id].history.unshift({ ...entry, at: Date.now() });
  db.users[id].history = db.users[id].history.slice(0, 20);
  saveDb(db);
}

const DEFAULT_GROUP = () => ({
  settings: {
    antilink: false,
    antispam: false,
    antiflood: false,
    antitoxic: false,
    antibot: false,
    antiraid: false,
    captcha: false,
    autoReply: true,
    cleanupJoinLeave: false,
    welcome: true,
  },
  blacklist: [],
  whitelist: [],
  warnings: {},
  approved: [],
  verified: [],
  filters: [],
  logs: [],
  roles: {},
  locked: false,
});

function addGroupLog(chatId, entry) {
  const group = getGroup(chatId);
  const logs = [{ ...entry, at: Date.now() }, ...(group.logs || [])].slice(0, 50);
  saveGroup(chatId, { logs });
}

function getUser(id) {
  const db = loadDb();
  if (!db.users[id]) {
    db.users[id] = DEFAULT_USER();
    saveDb(db);
    return db.users[id];
  }

  // Backfill any fields introduced after this user record was first created
  // (e.g. `equipped`, `username`) without touching their existing data,
  // and only write back if something was actually missing.
  const existing = db.users[id];
  const defaults = DEFAULT_USER();
  let changed = false;
  for (const key of Object.keys(defaults)) {
    if (!(key in existing)) {
      existing[key] = defaults[key];
      changed = true;
    }
  }
  if (!existing.equipped || typeof existing.equipped !== 'object') {
    existing.equipped = { weapon: null, armor: null, accessory: null };
    changed = true;
  } else {
    for (const slot of ['weapon', 'armor', 'accessory']) {
      if (!(slot in existing.equipped)) {
        existing.equipped[slot] = null;
        changed = true;
      }
    }
  }

  if (changed) saveDb(db);
  return existing;
}

function saveUser(id, data) {
  const db = loadDb();
  db.users[id] = { ...DEFAULT_USER(), ...db.users[id], ...data };
  saveDb(db);
  return db.users[id];
}

function getGroup(id) {
  const db = loadDb();
  if (!db.groups[id]) {
    db.groups[id] = DEFAULT_GROUP();
    saveDb(db);
  }
  return db.groups[id];
}

function saveGroup(id, data) {
  const db = loadDb();
  db.groups[id] = { ...DEFAULT_GROUP(), ...db.groups[id], ...data };
  saveDb(db);
  return db.groups[id];
}

/**
 * Called on every incoming update (see app.js middleware) to keep a
 * username -> id index up to date, so @mention targeting works even
 * when the mentioned user hasn't replied/isn't in the current chat.
 */
function trackUser(from) {
  if (!from || !from.id) return { isNew: false };
  const db = loadDb();
  const isNew = !db.users[from.id];
  if (!db.users[from.id]) db.users[from.id] = DEFAULT_USER();
  db.users[from.id].username = from.username || db.users[from.id].username || null;
  db.users[from.id].firstName = from.first_name || db.users[from.id].firstName || null;
  if (from.username) {
    db.usernames[from.username.toLowerCase()] = String(from.id);
  }
  saveDb(db);
  return { isNew };
}

/**
 * Resolves a "@username" (with or without the @) to a known user id,
 * based on everyone the bot has ever seen. Returns null if unknown.
 */
function resolveUsername(username) {
  const db = loadDb();
  const clean = String(username).replace(/^@/, '').toLowerCase();
  return db.usernames[clean] || null;
}

function getLeaderboard(limit = 10) {
  const db = loadDb();
  return Object.entries(db.users)
    .map(([id, u]) => ({ id, ...u }))
    .sort((a, b) => b.balance + b.bank - (a.balance + a.bank))
    .slice(0, limit);
}

function getAllUserIds() {
  const db = loadDb();
  return Object.keys(db.users);
}

module.exports = {
  getUser,
  saveUser,
  getGroup,
  saveGroup,
  getLeaderboard,
  addHistory,
  addGroupLog,
  getAllUserIds,
  trackUser,
  resolveUsername,
  DEFAULT_USER,
  DEFAULT_GROUP,
};
