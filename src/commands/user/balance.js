const { getUser } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'balance',
  description: 'Check your coin balance',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    await ctx.reply(`💰 Balance: *${user.balance}${config.economy.currencySymbol}*`, { parse_mode: 'Markdown' });
  },
};
