const { getUser } = require('../../database/store');

module.exports = {
  name: 'badge',
  description: 'View your earned badges',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    if (!user.badges.length) {
      await ctx.reply('🏅 You have no badges yet. Keep being active to earn some!');
      return;
    }
    await ctx.reply(`🏅 *Your Badges*\n\n${user.badges.join('  ')}`, { parse_mode: 'Markdown' });
  },
};
