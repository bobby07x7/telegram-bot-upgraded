const { getState, saveState } = require('../../database/botState');

// /addbot <BOT_TOKEN> [BOT_NAME]
module.exports = {
  name: 'addbot',
  description: 'Add an extra bot token (owner only) — /addbot <BOT_TOKEN> [BOT_NAME]',
  ownerOnly: true,
  execute: async (ctx) => {
    const parts = (ctx.message.text || '').trim().split(/\s+/);
    const [, token, ...nameParts] = parts;
    const botName = nameParts.join(' ').trim();

    if (!token) return ctx.reply('Usage: /addbot <BOT_TOKEN> [BOT_NAME]');
    if (token.length < 20) return ctx.reply('❌ Invalid token (too short).');

    const state = getState();
    const extraBots = Array.isArray(state.extraBots) ? state.extraBots : [];

    if (extraBots.some((b) => String(b.token) === String(token))) {
      return ctx.reply('❌ This bot token is already added.');
    }

    extraBots.push({ token, name: botName || '', addedAt: Date.now() });
    saveState({ extraBots });

    await ctx.reply(`✅ Bot added${botName ? `: ${botName}` : ''}. Restart bot to activate.`);
  },
};

