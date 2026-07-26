const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'premiumremove',
  description: 'Revoke premium status from a user (reply to their message)',
  ownerOnly: true,
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;
    if (!target) return ctx.reply('↩️ Reply to the user you want to revoke premium from.');
    saveUser(target.id, { isPremium: false });
    await ctx.reply(`✅ Premium revoked for ${target.first_name}.`);
  },
};
