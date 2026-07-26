const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'gachahistory',
  description: 'View your recent gacha pull history',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const pulls = (user.history || []).filter((h) => h.type && h.type.startsWith('gacha'));
    if (!pulls.length) return ctx.reply('📜 No gacha pulls yet — try /spin!');
    const lines = pulls.slice(0, 10).map((p) => `• ${p.type}: ${p.item || (p.items || []).join(', ')}`);
    await ctx.reply(`📜 *Recent Gacha History*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
