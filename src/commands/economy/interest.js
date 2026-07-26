const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'interest',
  description: 'Claim interest earned on your bank balance (once per 24h)',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (user.lastInterest && now - user.lastInterest < cooldown) {
      const hrs = Math.ceil((cooldown - (now - user.lastInterest)) / 3600000);
      return ctx.reply(`⏳ Already claimed. Try again in ~${hrs}h.`);
    }
    const earned = Math.floor(user.bank * config.economy.bankInterestRate);
    if (earned <= 0) return ctx.reply('📉 Your bank balance is too low to earn interest.');

    saveUser(id, { bank: user.bank + earned, lastInterest: now });
    addHistory(id, { type: 'bank interest', amount: earned });
    await ctx.reply(`📈 Earned ${earned}${config.economy.currencySymbol} interest (${config.economy.bankInterestRate * 100}% of bank balance).`);
  },
};
