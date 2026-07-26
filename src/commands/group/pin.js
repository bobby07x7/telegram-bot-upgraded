const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'pin',
  description: 'Pin a message (reply to the message you want to pin)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    if (!ctx.message.reply_to_message) return ctx.reply('↩️ Reply to the message you want to pin.');
    await ctx.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id);
    await ctx.reply('📌 Message pinned.');
  },
};
