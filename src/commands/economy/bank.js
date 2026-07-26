const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'bank',
  description: 'View your bank balance and available loan info',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    await ctx.reply(
      `🏦 *Bank*\n\nBalance: ${user.bank}${config.economy.currencySymbol}\nOutstanding loan: ${user.loan || 0}${config.economy.currencySymbol}\nMax loan available: ${user.bank * 2}${config.economy.currencySymbol}\n\nUse /deposit, /withdraw, /loan, /repay, /interest`,
      { parse_mode: 'Markdown' }
    );
  },
};
