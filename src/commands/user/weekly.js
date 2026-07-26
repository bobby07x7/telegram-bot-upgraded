const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'weekly',
  description: 'Claim your weekly coin reward',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const now = Date.now();
    const remaining = user.lastWeekly + config.economy.weeklyCooldownMs - now;

    if (remaining > 0) {
      const days = Math.ceil(remaining / 86400000);
      await ctx.reply(`⏳ Already claimed this week. Try again in ~${days}d.`);
      return;
    }

    const amount = config.economy.weeklyAmount;
    saveUser(id, { balance: user.balance + amount, lastWeekly: now });
    addHistory(id, { type: 'weekly reward', amount });
    await ctx.reply(`✅ Weekly reward claimed: +${amount}${config.economy.currencySymbol}`);
  },
};
