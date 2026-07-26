const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'loan',
  description: 'Take a loan against your bank balance (max 2x your bank)',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const amount = parseInt((ctx.message.text.split(' ')[1] || '').trim(), 10);
    const maxLoan = user.bank * 2;

    if (user.loan && user.loan > 0) {
      return ctx.reply(`❌ You already have an outstanding loan of ${user.loan}${config.economy.currencySymbol}. Use /repay first.`);
    }
    if (!amount || amount <= 0) return ctx.reply(`Usage: /loan <amount>\nMax loan available: ${maxLoan}${config.economy.currencySymbol}`);
    if (amount > maxLoan) return ctx.reply(`❌ Max loan is 2x your bank balance (${maxLoan}${config.economy.currencySymbol}).`);

    saveUser(id, { balance: user.balance + amount, loan: amount });
    addHistory(id, { type: 'loan taken', amount });
    await ctx.reply(`🏦 Loan approved: +${amount}${config.economy.currencySymbol}. Repay with /repay (10% interest).`);
  },
};
