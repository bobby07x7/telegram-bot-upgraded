const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'drop',
  description: 'View drop rates for each rarity tier',
  execute: async (ctx) => {
    const total = config.gacha.rarities.reduce((s, r) => s + r.weight, 0);
    const lines = ['📊 *Drop Rates*', ''];
    for (const r of config.gacha.rarities) {
      lines.push(`${r.emoji} ${r.label}: ${((r.weight / total) * 100).toFixed(1)}%`);
    }
    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  },
};
