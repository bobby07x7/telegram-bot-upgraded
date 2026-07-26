const { getUser } = require('../../database/store');

module.exports = {
  name: 'referral',
  description: 'Get your referral link and stats',
  execute: async (ctx) => {
    const botInfo = await ctx.telegram.getMe();
    const user = getUser(ctx.from.id);
    const link = `https://t.me/${botInfo.username}?start=ref_${ctx.from.id}`;

    await ctx.reply(
      `🔗 *Your Referral Link*\n${link}\n\n` +
      `👥 Total referrals: ${user.referrals}\n\n` +
      `_Share this link — when someone starts the bot with it, you both get rewarded._`,
      { parse_mode: 'Markdown' }
    );
  },
};
