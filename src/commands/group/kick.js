const { addGroupLog } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'kick',
  description: 'Remove a member from the group (they can rejoin) — reply, @mention, or user id',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('↩️ Reply to, @mention, or pass the user id of the member you want to kick.');

    await ctx.telegram.banChatMember(ctx.chat.id, target.id);
    await ctx.telegram.unbanChatMember(ctx.chat.id, target.id);
    addGroupLog(ctx.chat.id, { action: 'kick', by: ctx.from.id, target: target.id });
    await ctx.reply(`👢 Kicked ${target.first_name || target.username || target.id}.`);
  },
};
