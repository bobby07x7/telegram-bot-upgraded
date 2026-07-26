const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'daily',
  description: 'Claim your daily coin reward',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const now = Date.now();
    const remaining = user.lastDaily + config.economy.dailyCooldownMs - now;

    if (remaining > 0) {
      const hrs = Math.ceil(remaining / 3600000);
      await ctx.reply(`⏳ You already claimed today. Try again in ~${hrs}h.`);
      return;
    }

    const amount = config.economy.dailyAmount;
    saveUser(id, { balance: user.balance + amount, lastDaily: now });
    addHistory(id, { type: 'daily reward', amount });
    await ctx.reply(`✅ You claimed your daily reward: +${amount}${config.economy.currencySymbol}`);
  },
};
