const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'claim',
  description: 'Claim any pending rewards (coupons, events, referral bonuses)',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    if (!user.pendingReward || user.pendingReward <= 0) return ctx.reply('📭 No pending rewards to claim right now.');
    saveUser(id, { balance: user.balance + user.pendingReward, pendingReward: 0 });
    addHistory(id, { type: 'claimed reward', amount: user.pendingReward });
    await ctx.reply(`✅ Claimed ${user.pendingReward}${config.economy.currencySymbol}!`);
  },
};
