const { getState, saveState } = require('../database/botState');

/**
 * Marks a user as "logged in" as of right now. Session state is persisted
 * to storage/state.json (via botState), so it survives bot restarts.
 */
function login(userId) {
  const state = getState();
  saveState({ adminSessions: { ...state.adminSessions, [String(userId)]: Date.now() } });
}

/** Clears a user's session — used by /logoutadmin. */
function logout(userId) {
  const state = getState();
  const sessions = { ...state.adminSessions };
  delete sessions[String(userId)];
  saveState({ adminSessions: sessions });
}

/**
 * True if the user logged in within the last `sessionMs` milliseconds.
 * Expired sessions are treated as logged-out (but aren't actively cleaned
 * up here — they just get overwritten on the next successful login).
 */
function isLoggedIn(userId, sessionMs) {
  const state = getState();
  const loginTime = state.adminSessions[String(userId)];
  if (!loginTime) return false;
  return Date.now() - loginTime <= sessionMs;
}

module.exports = { login, logout, isLoggedIn };
