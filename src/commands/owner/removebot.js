const { getState, saveState } = require('../../database/botState');

// /removebot <token> OR /removebot <index>
module.exports = {
  name: 'removebot',
  description: 'Remove an extra bot token (owner only) — /removebot <token_or_index>',
  ownerOnly: true,
  execute: async (ctx) => {
    const parts = (ctx.message.text || '').trim().split(/\s+/);
    const [, target] = parts;

    if (!target) return ctx.reply('Usage: /removebot <token_or_index>');

    const state = getState();
    const extraBots = Array.isArray(state.extraBots) ? state.extraBots : [];

    let next;

    const idx = Number(target);
    if (!Number.isNaN(idx)) {
      const i = idx; // 1-based index shown to users
      if (i < 1 || i > extraBots.length) return ctx.reply('❌ Invalid index. Use /bots to see list.');
      next = extraBots.slice(0, i - 1).concat(extraBots.slice(i));
    } else {
      if (!extraBots.some((b) => String(b.token) === String(target))) {
        return ctx.reply('❌ Token not found.');
      }
      next = extraBots.filter((b) => String(b.token) !== String(target));
    }

    saveState({ extraBots: next });
    await ctx.reply('✅ Extra bot removed. Restart bot to apply changes.');
  },
};

