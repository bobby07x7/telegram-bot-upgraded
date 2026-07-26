const { getUser } = require('../../database/store');

module.exports = {
  name: 'history',
  description: 'View your last 20 economy transactions',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    if (!user.history || !user.history.length) {
      await ctx.reply('📜 No transaction history yet.');
      return;
    }
    const lines = user.history.map((h) => `• ${h.type}: ${h.amount > 0 ? '+' : ''}${h.amount} (${new Date(h.at).toLocaleString()})`);
    await ctx.reply(`📜 *Transaction History*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
