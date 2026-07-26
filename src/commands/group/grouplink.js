const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'grouplink',
  description: 'Get the group\'s invite link (admin only)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const link = await ctx.telegram.exportChatInviteLink(ctx.chat.id);
    await ctx.reply(`🔗 ${link}`);
  },
};
