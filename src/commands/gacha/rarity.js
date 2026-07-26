const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'rarity',
  description: 'Check the rarity tiers and their emoji legend',
  execute: async (ctx) => {
    const lines = config.gacha.rarities.map((r) => `${r.emoji} ${r.label}`);
    await ctx.reply(`🏷️ *Rarity Legend*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
