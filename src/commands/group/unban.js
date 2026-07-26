const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'unban',
  description: 'Lift a ban on a user — reply, @mention, or /unban <user_id>',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('Usage: /unban <user_id> (or reply/@mention a known user).');

    await ctx.telegram.unbanChatMember(ctx.chat.id, target.id);
    await ctx.reply('✅ User unbanned.');
  },
};
