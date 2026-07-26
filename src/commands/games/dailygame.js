const PRIZES = [50, 100, 200, 500, 1000];

module.exports = {
  name: 'dailygame',
  description: 'Spin the daily prize wheel (once per day)',
  execute: async (ctx) => {
    const { getUser, saveUser, addHistory } = require('../../database/store');
    const { config } = require('../../config/config');
    const user = getUser(ctx.from.id);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (user.lastSpin && now - user.lastSpin < cooldown) {
      const hrs = Math.ceil((user.lastSpin + cooldown - now) / 3600000);
      await ctx.reply(`⏳ You already played today. Try again in ~${hrs}h.`);
      return;
    }

    const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    saveUser(ctx.from.id, { balance: user.balance + prize, lastSpin: now });
    addHistory(ctx.from.id, { type: 'daily game prize', amount: prize });

    await ctx.reply(`🎡 The wheel landed on: *${prize}${config.economy.currencySymbol}*! Added to your balance.`, { parse_mode: 'Markdown' });
  },
};
