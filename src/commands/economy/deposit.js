const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'deposit',
  description: 'Deposit coins from wallet into your bank',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const amount = parseInt((ctx.message.text.split(' ')[1] || '').trim(), 10);

    if (!amount || amount <= 0) {
      await ctx.reply(`Usage: /deposit <amount>\nWallet balance: ${user.balance}${config.economy.currencySymbol}`);
      return;
    }
    if (amount > user.balance) {
      await ctx.reply('❌ You don\'t have that much in your wallet.');
      return;
    }
    saveUser(id, { balance: user.balance - amount, bank: user.bank + amount });
    addHistory(id, { type: 'deposit', amount });
    await ctx.reply(`🏦 Deposited ${amount}${config.economy.currencySymbol} into your bank.`);
  },
};
