const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'unpin',
  description: 'Unpin the current pinned message',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    await ctx.telegram.unpinChatMessage(ctx.chat.id);
    await ctx.reply('📌 Message unpinned.');
  },
};
