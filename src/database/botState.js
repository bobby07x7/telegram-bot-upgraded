const fs = require('fs');
const path = require('path');

const STATE_PATH = path.join(__dirname, '..', '..', 'storage', 'state.json');

const DEFAULT_STATE = () => ({
  maintenance: false,
  extraAdmins: [],
  disabledCommands: [],
  featureFlags: {},
  // userId -> timestamp (ms) of last successful /loginadmin, used by the
  // admin password lock (see core/adminSession.js).
  adminSessions: {},
  // userIds in here are silently skipped by the "new user" log-group post,
  // managed via /logmanage (owner-only).
  logIgnoreList: [],
});

function getState() {
  if (!fs.existsSync(STATE_PATH)) {
    const fresh = DEFAULT_STATE();
    fs.writeFileSync(STATE_PATH, JSON.stringify(fresh, null, 2));
    return fresh;
  }
  try {
    return { ...DEFAULT_STATE(), ...JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) };
  } catch (_) {
    return DEFAULT_STATE();
  }
}

function saveState(patch) {
  const current = getState();
  const updated = { ...current, ...patch };
  fs.writeFileSync(STATE_PATH, JSON.stringify(updated, null, 2));
  return updated;
}

module.exports = { getState, saveState };
