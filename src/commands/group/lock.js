const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'lock',
  description: 'Lock the group so only admins can send messages',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    await ctx.telegram.setChatPermissions(ctx.chat.id, { can_send_messages: false });
    saveGroup(ctx.chat.id, { locked: true });
    await ctx.reply('🔒 Group locked. Only admins can send messages now.');
  },
};
