const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'luckcheck',
  description: 'Check your current gacha luck rating (based on inventory rarity)',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const rareCount = user.inventory.filter((i) => i.startsWith('🔵') || i.startsWith('🟣') || i.startsWith('🟡')).length;
    const luckScore = Math.min(100, rareCount * 7 + Math.floor(Math.random() * 20));
    await ctx.reply(`🍀 Your current gacha luck rating: ${luckScore}/100`);
  },
};
