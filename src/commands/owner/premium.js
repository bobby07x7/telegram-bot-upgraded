const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'premium',
  description: 'Check a user\'s premium status — reply to their message, or self if no reply',
  ownerOnly: true,
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from || ctx.from;
    const user = getUser(target.id);
    await ctx.reply(`${user.isPremium ? '💎 Premium' : '👤 Free'} — ${target.first_name}`);
  },
};
