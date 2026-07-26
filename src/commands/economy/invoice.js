const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'invoice',
  description: 'Generate a payment invoice to request coins — /invoice <amount> <reason>',
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ').slice(1);
    const amount = parseInt(parts[0], 10);
    const reason = parts.slice(1).join(' ') || 'No reason given';
    if (!amount) return ctx.reply('Usage: /invoice <amount> <reason>');
    await ctx.reply(
      `🧾 *Invoice*\n\nFrom: ${ctx.from.first_name}\nAmount: ${amount}${config.economy.currencySymbol}\nReason: ${reason}\n\nShare this message so someone can /send you the amount.`,
      { parse_mode: 'Markdown' }
    );
  },
};
