const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'bonus',
  description: 'Check your active spin bonuses (from referrals, events, etc.)',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const bonusSpins = user.referrals || 0;
    await ctx.reply(`🎯 Base free spins: ${config.gacha.dailyFreeSpins}/day\n🎁 Referral bonus spins: +${bonusSpins}/day\n\nTotal: ${config.gacha.dailyFreeSpins + bonusSpins}/day`);
  },
};
