const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'storage', 'db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    const fresh = { users: {}, groups: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(fresh, null, 2));
    return fresh;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const DEFAULT_USER = (config) => ({
  balance: config.economy.startingBalance,
  bank: 0,
  xp: 0,
  level: 1,
  lastDaily: 0,
  lastWeekly: 0,
  inventory: [],
  gacha: { pulls: 0, collection: [] },
});

function getUser(userId, config) {
  const db = readDb();
  if (!db.users[userId]) {
    db.users[userId] = DEFAULT_USER(config);
    writeDb(db);
  }
  return db.users[userId];
}

function saveUser(userId, patch) {
  const db = readDb();
  db.users[userId] = { ...db.users[userId], ...patch };
  writeDb(db);
  return db.users[userId];
}

function getGroup(groupId) {
  const db = readDb();
  if (!db.groups[groupId]) {
    db.groups[groupId] = {
      security: { antiSpam: false, antiFlood: false, antiLink: false, antiRaid: false },
      blacklist: [], whitelist: [], filters: [],
      welcomeMessage: null,
    };
    writeDb(db);
  }
  return db.groups[groupId];
}

function saveGroup(groupId, patch) {
  const db = readDb();
  db.groups[groupId] = { ...db.groups[groupId], ...patch };
  writeDb(db);
  return db.groups[groupId];
}

module.exports = { getUser, saveUser, getGroup, saveGroup };
