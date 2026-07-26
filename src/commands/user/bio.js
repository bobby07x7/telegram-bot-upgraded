const { getUser } = require('../../database/store');

module.exports = {
  name: 'bio',
  description: 'View your current bio',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    await ctx.reply(user.bio ? `📝 Your bio:\n${user.bio}` : '📝 You have no bio set. Use /setbio <text>.');
  },
};
