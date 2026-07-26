const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'addadmin',
  description: 'Grant bot-admin privileges to a user — /addadmin <user_id> (or reply to their message)',
  ownerOnly: true,
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;
    const userId = target ? String(target.id) : (ctx.message.text.split(' ')[1] || '').trim();
    if (!userId) return ctx.reply('Usage: /addadmin <user_id> (or reply to their message)');

    const state = getState();
    if (state.extraAdmins.includes(userId)) return ctx.reply('❌ Already an admin.');
    saveState({ extraAdmins: [...state.extraAdmins, userId] });
    await ctx.reply(`✅ User ${userId} is now a bot admin.`);
  },
};
