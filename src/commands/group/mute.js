const { addGroupLog } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'mute',
  description: 'Restrict a member from sending messages — reply, @mention, or user id',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('↩️ Reply to, @mention, or pass the user id of the member you want to mute.');

    await ctx.telegram.restrictChatMember(ctx.chat.id, target.id, {
      permissions: { can_send_messages: false },
    });
    addGroupLog(ctx.chat.id, { action: 'mute', by: ctx.from.id, target: target.id });
    await ctx.reply(`🔇 Muted ${target.first_name || target.username || target.id}.`);
  },
};
