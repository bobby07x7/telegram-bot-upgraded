const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'unlock',
  description: 'Unlock the group so all members can send messages again',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    await ctx.telegram.setChatPermissions(ctx.chat.id, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
    });
    saveGroup(ctx.chat.id, { locked: false });
    await ctx.reply('🔓 Group unlocked. Everyone can send messages again.');
  },
};
