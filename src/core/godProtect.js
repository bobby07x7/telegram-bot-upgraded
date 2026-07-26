const { isOwnerOrAdmin } = require('./permissions');

/**
 * Builds the "you can't touch the owner/admin" reply used by every PvP-style
 * command (fight, kill, duel, ...). Centralized here so the flavor text only
 * needs to change in one place.
 */
function protectMessage(name) {
  return (
    `🛡️ *WHOA THERE, CHAMP!* 🛡️\n\n` +
    `😤 Arre Nadaan! *${name}* Ko Marna Tere Bas Ki Baat Nahi Hai...\n` +
    `Wo Is Bot Ka *GOD* Hai! 👑🔥\n\n` +
    `_Chal, kisi aur ko try kar... koi tere level ka. 😏_`
  );
}

module.exports = { protectMessage, isProtectedTarget: isOwnerOrAdmin };
