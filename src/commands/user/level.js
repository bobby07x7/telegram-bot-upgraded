const { getUser } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'level',
  description: 'Check your XP level',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const xpNeeded = config.economy.xpPerLevel;
    const progress = user.xp % xpNeeded;
    const barLength = 10;
    const filled = Math.round((progress / xpNeeded) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    await ctx.reply(
      `⭐ *Level ${user.level}*\n` +
      `${bar}\n` +
      `${progress}/${xpNeeded} XP to next level`,
      { parse_mode: 'Markdown' }
    );
  },
};
