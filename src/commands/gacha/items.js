const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

const { ITEM_POOL } = require('../../core/gachaEngine');

module.exports = {
  name: 'items',
  description: 'View all obtainable gacha items by rarity',
  execute: async (ctx) => {
    const lines = ['🎁 *All Gacha Items*', ''];
    for (const rarity of config.gacha.rarities) {
      lines.push(`${rarity.emoji} *${rarity.label}*`);
      for (const item of ITEM_POOL[rarity.key]) lines.push(`  • ${item}`);
      lines.push('');
    }
    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  },
};
