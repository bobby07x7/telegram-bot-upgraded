const { getUser } = require('../../database/store');
const { buildWalletText } = require('../../core/profileCard');

module.exports = {
  name: 'wallet',
  description: 'View your wallet + bank breakdown, casino-style',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    await ctx.reply(buildWalletText(user), { parse_mode: 'Markdown' });
  },
};
