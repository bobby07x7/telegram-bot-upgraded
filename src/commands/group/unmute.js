const { addGroupLog } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'unmute',
  description: "Restore a muted member's permissions — reply, @mention, or user id",
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('↩️ Reply to, @mention, or pass the user id of the member you want to unmute.');

    await ctx.telegram.restrictChatMember(ctx.chat.id, target.id, {
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
      },
    });
    addGroupLog(ctx.chat.id, { action: 'unmute', by: ctx.from.id, target: target.id });
    await ctx.reply(`🔊 Unmuted ${target.first_name || target.username || target.id}.`);
  },
};
