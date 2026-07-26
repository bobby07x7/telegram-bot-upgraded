const { config } = require('../config/config');
const { getItem, displayName } = require('../database/items');
const { buildProgressBar } = require('./uiHelper');

function buildProfileText(firstName, user) {
  const { currencySymbol } = config.economy;
  const xpNeeded = config.economy.xpPerLevel;
  const bar = buildProgressBar(user.xp % xpNeeded, xpNeeded);
  const equipped = user.equipped || {};

  const gearLine = (slot, label) => {
    const stored = equipped[slot];
    const item = stored ? getItem(stored) : null;
    return `║ ${label}: ${item ? displayName(item) : '— none —'}`;
  };

  return (
    `╔══════ 👤 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 ══════╗\n` +
    `║ ${firstName}\n` +
    `║\n` +
    `║ 💰 Balance : ${user.balance}${currencySymbol}\n` +
    `║ 🏦 Bank    : ${user.bank}${currencySymbol}\n` +
    `║ ⭐ Level   : ${user.level}\n` +
    `║ ${bar}\n` +
    `║\n` +
    `${gearLine('weapon', '⚔️ Weapon')}\n` +
    `${gearLine('armor', '🛡️ Armor')}\n` +
    `${gearLine('accessory', '💍 Accessory')}\n` +
    `║\n` +
    `║ 🏅 Badges  : ${user.badges.length ? user.badges.join(' ') : 'None yet'}\n` +
    `║ 📝 Bio     : ${user.bio || 'Not set — use /setbio'}\n` +
    `║ 👥 Referrals: ${user.referrals}\n` +
    `╚═══════════════════════╝`
  );
}

function buildWalletText(user) {
  const { currencySymbol } = config.economy;
  const netWorth = user.balance + user.bank;
  return (
    `╔══════ 👛 𝐖𝐀𝐋𝐋𝐄𝐓 ══════╗\n` +
    `║\n` +
    `║ 💵 Cash        : ${user.balance}${currencySymbol}\n` +
    `║ 🏦 Bank        : ${user.bank}${currencySymbol}\n` +
    `║ ─────────────────────\n` +
    `║ 💎 Net Worth   : ${netWorth}${currencySymbol}\n` +
    `║\n` +
    `║ 📥 /deposit  📤 /withdraw\n` +
    `║ 💸 /send  🎁 /gift  🛒 /shop\n` +
    `╚═══════════════════════╝`
  );
}

module.exports = { buildProfileText, buildWalletText };
