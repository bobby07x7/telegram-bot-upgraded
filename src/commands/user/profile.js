const { getUser } = require('../../database/store');
const { buildProfileText } = require('../../core/profileCard');

module.exports = {
  name: 'profile',
  description: 'View your profile card (balance, level, gear, badges)',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    await ctx.reply(buildProfileText(ctx.from.first_name, user), { parse_mode: 'Markdown' });
  },
};
