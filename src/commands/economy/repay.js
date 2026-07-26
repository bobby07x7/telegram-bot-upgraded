const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'repay',
  description: 'Repay your outstanding loan (with 10% interest)',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);

    if (!user.loan || user.loan <= 0) return ctx.reply('✅ You have no outstanding loan.');

    const totalOwed = Math.ceil(user.loan * 1.1);
    if (user.balance < totalOwed) {
      return ctx.reply(`❌ You owe ${totalOwed}${config.economy.currencySymbol} (incl. 10% interest) but only have ${user.balance}${config.economy.currencySymbol}.`);
    }
    saveUser(id, { balance: user.balance - totalOwed, loan: 0 });
    addHistory(id, { type: 'loan repaid', amount: -totalOwed });
    await ctx.reply(`✅ Loan repaid in full: -${totalOwed}${config.economy.currencySymbol}.`);
  },
};
