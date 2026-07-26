const { getState } = require('../../database/botState');
const { config } = require('../../config/config');

function maskToken(t) {
  const s = String(t);
  if (s.length <= 10) return '********';
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}

module.exports = {
  name: 'bots',
  description: 'List configured bots (owner only)',
  ownerOnly: true,
  execute: async (ctx) => {
    const state = getState();
    const extraBots = Array.isArray(state.extraBots) ? state.extraBots : [];

    const lines = [];
    lines.push(`Main bot: ${maskToken(config.bot.token)}${config.bot.ownerId ? '' : ''}`);
    lines.push(`Extra bots: ${extraBots.length}`);

    if (!extraBots.length) {
      lines.push('—');
    } else {
      extraBots.forEach((b, i) => {
        const name = b.name ? ` (${b.name})` : '';
        lines.push(`${i + 1}) ${maskToken(b.token)}${name}`);
      });
    }

    await ctx.reply(lines.join('\n'));
  },
};

