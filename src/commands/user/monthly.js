const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'monthly',
  description: 'Claim your monthly coin reward',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const now = Date.now();
    const remaining = user.lastMonthly + config.economy.monthlyCooldownMs - now;

    if (remaining > 0) {
      const days = Math.ceil(remaining / 86400000);
      await ctx.reply(`⏳ Already claimed this month. Try again in ~${days}d.`);
      return;
    }

    const amount = config.economy.monthlyAmount;
    saveUser(id, { balance: user.balance + amount, lastMonthly: now });
    addHistory(id, { type: 'monthly reward', amount });
    await ctx.reply(`✅ Monthly reward claimed: +${amount}${config.economy.currencySymbol}`);
  },
};
