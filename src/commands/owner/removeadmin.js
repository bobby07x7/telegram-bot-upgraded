const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'removeadmin',
  description: 'Revoke bot-admin privileges — /removeadmin <user_id> (or reply to their message)',
  ownerOnly: true,
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;
    const userId = target ? String(target.id) : (ctx.message.text.split(' ')[1] || '').trim();
    if (!userId) return ctx.reply('Usage: /removeadmin <user_id> (or reply to their message)');

    const state = getState();
    saveState({ extraAdmins: state.extraAdmins.filter((id) => id !== userId) });
    await ctx.reply(`✅ User ${userId} removed from bot admins.`);
  },
};
