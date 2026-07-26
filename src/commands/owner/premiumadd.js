const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'premiumadd',
  description: 'Grant premium status to a user (reply to their message)',
  ownerOnly: true,
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;
    if (!target) return ctx.reply('↩️ Reply to the user you want to grant premium to.');
    saveUser(target.id, { isPremium: true });
    await ctx.reply(`💎 ${target.first_name} is now premium.`);
  },
};
