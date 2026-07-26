const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'withdraw',
  description: 'Withdraw coins from bank into your wallet',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const amount = parseInt((ctx.message.text.split(' ')[1] || '').trim(), 10);

    if (!amount || amount <= 0) {
      await ctx.reply(`Usage: /withdraw <amount>\nBank balance: ${user.bank}${config.economy.currencySymbol}`);
      return;
    }
    if (amount > user.bank) {
      await ctx.reply('❌ You don\'t have that much in your bank.');
      return;
    }
    saveUser(id, { balance: user.balance + amount, bank: user.bank - amount });
    addHistory(id, { type: 'withdraw', amount });
    await ctx.reply(`💵 Withdrew ${amount}${config.economy.currencySymbol} to your wallet.`);
  },
};
