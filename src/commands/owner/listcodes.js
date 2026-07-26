const { listCodes } = require('../../core/codeStore');
const { findItem, displayName } = require('../../database/items');
const { config } = require('../../config/config');

module.exports = {
  name: 'listcodes',
  description: 'List all redeem codes and their usage stats',
  ownerOnly: true,
  execute: async (ctx) => {
    const codes = listCodes();
    const entries = Object.entries(codes);

    if (entries.length === 0) {
      return ctx.reply('📭 No redeem codes exist yet.\nCreate one with /createcode.');
    }

    const lines = entries.map(([key, c]) => {
      const expired = c.expiresAt && Date.now() > c.expiresAt;
      const usedUp = c.maxUses !== null && c.uses >= c.maxUses;
      const status = expired ? '⛔ expired' : usedUp ? '🚫 used up' : '✅ active';
      const rewardLine = c.type === 'coins'
        ? `${c.value}${config.economy.currencySymbol}`
        : displayName(findItem(c.value) || { emoji: '❔', name: c.value });
      const usesLine = `${c.uses}/${c.maxUses === null ? '∞' : c.maxUses} uses`;
      const expiryLine = c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'no expiry';
      return `🎟️ \`${key}\` — ${rewardLine} — ${usesLine} — ${expiryLine} — ${status}`;
    });

    await ctx.reply(`🗂️ *Redeem codes (${entries.length})*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
