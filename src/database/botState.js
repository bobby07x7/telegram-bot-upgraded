const fs = require('fs');
const path = require('path');

const STATE_PATH = path.join(__dirname, '..', '..', 'storage', 'state.json');

function readState() {
  if (!fs.existsSync(STATE_PATH)) {
    const fresh = { maintenanceMode: false, admins: [], featureFlags: {} };
    fs.writeFileSync(STATE_PATH, JSON.stringify(fresh, null, 2));
    return fresh;
  }
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function writeState(patch) {
  const state = { ...readState(), ...patch };
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  return state;
}

module.exports = { readState, writeState };
