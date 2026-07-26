const { getLeaderboard } = require('../../database/store');

module.exports = {
  name: 'rank',
  description: 'See your position on the leaderboard',
  execute: async (ctx) => {
    const all = getLeaderboard(100000);
    const index = all.findIndex((u) => String(u.id) === String(ctx.from.id));

    if (index === -1) {
      await ctx.reply("📊 You're not ranked yet — start earning coins first!");
      return;
    }

    await ctx.reply(`📊 Your rank: *#${index + 1}* out of ${all.length} users`, { parse_mode: 'Markdown' });
  },
};
