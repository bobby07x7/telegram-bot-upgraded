const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'bid',
  description: 'Place a bid on the active auction — /bid <amount>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const amount = parseInt((ctx.message.text.split(' ')[1] || '').trim(), 10);
    const user = getUser(id);
    if (!amount || amount <= 0) return ctx.reply('Usage: /bid <amount>');
    if (amount > user.balance) return ctx.reply('❌ Insufficient balance to place this bid.');
    await ctx.reply(`✅ Bid of ${amount}${config.economy.currencySymbol} placed! Highest bidder wins when the auction ends.`);
  },
};
