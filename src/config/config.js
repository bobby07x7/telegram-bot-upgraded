require('dotenv').config();

/**
 * Central config file.
 * Whenever you need a new env variable, add it here —
 * the rest of the project accesses everything through this object.
 */
const config = {
  bot: {
    token: process.env.BOT_TOKEN,
    ownerId: process.env.OWNER_ID,
    // Telegram group/channel the bot posts operational logs to (startup,
    // new users, errors). Must be a supergroup/channel id (starts with
    // -100...) and the bot must be a member/admin of it. Leave empty to
    // disable log-group posting entirely.
    logGroupId: process.env.LOG_GROUP_ID || '-1003666356509',
  },
  bot_meta: {
    name: process.env.BOT_NAME || 'My Bot',
  },
  links: {
    supportGroup: process.env.SUPPORT_GROUP_URL || 'https://t.me/',
    supportChannel: process.env.SUPPORT_CHANNEL_URL || 'https://t.me/',
    developer: process.env.DEVELOPER_URL || 'https://t.me/',
    addToGroupUrl: process.env.ADD_TO_GROUP_URL || '', // if empty, the button link is auto-generated
  },
  economy: {
    currencySymbol: '🪙',
    currencyName: 'Coins',
    dailyAmount: 500,
    weeklyAmount: 2500,
    monthlyAmount: 8000,
    dailyCooldownMs: 24 * 60 * 60 * 1000,
    weeklyCooldownMs: 7 * 24 * 60 * 60 * 1000,
    monthlyCooldownMs: 30 * 24 * 60 * 60 * 1000,
    bankInterestRate: 0.02, // 2% per /interest claim
    taxRate: 0.05, // 5% tax on /send transfers above 1000
    xpPerLevel: 1000,
  },
  media: {
    apiBaseUrl: process.env.MEDIA_API_BASE_URL || '',
    apiKey: process.env.MEDIA_API_KEY || '',
  },
  gacha: {
    spinCost: 100,
    dailyFreeSpins: 3,
    rarities: [
      { key: 'common', label: 'Common', weight: 55, emoji: '⚪' },
      { key: 'uncommon', label: 'Uncommon', weight: 25, emoji: '🟢' },
      { key: 'rare', label: 'Rare', weight: 12, emoji: '🔵' },
      { key: 'epic', label: 'Epic', weight: 6, emoji: '🟣' },
      { key: 'legendary', label: 'Legendary', weight: 2, emoji: '🟡' },
    ],
  },
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  security: {
    // If set, every owner/admin command AND every admin-only view (menus,
    // GOD mode, protection checks, etc.) additionally requires the user to
    // run /loginadmin <password> for this session before they work.
    // Leave unset (default) to keep the bot usable with no extra setup —
    // owner/admin status alone is enough, same as before.
    adminPassword: process.env.ADMIN_PASSWORD || '',
    adminSessionMs: Number(process.env.ADMIN_SESSION_MS) || 60 * 60 * 1000, // 1 hour
  },
};

// Check required variables on startup, otherwise throw a clear error
function validateConfig() {
  const missing = [];
  if (!config.bot.token) missing.push('BOT_TOKEN');
  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
      `Copy .env.example to .env and fill in the values.`
    );
  }
}

module.exports = { config, validateConfig };
