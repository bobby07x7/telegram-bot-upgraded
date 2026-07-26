const { getLeaderboard } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'leaderboard',
  description: 'View the top 10 richest users',
  execute: async (ctx) => {
    const top = getLeaderboard(10);
    if (!top.length) {
      await ctx.reply('📊 No users on the leaderboard yet.');
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    const lines = top.map((u, i) => {
      const rank = medals[i] || `${i + 1}.`;
      return `${rank} ID ${u.id} — ${u.balance + u.bank}${config.economy.currencySymbol}`;
    });

    await ctx.reply(`🏆 *Leaderboard*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
