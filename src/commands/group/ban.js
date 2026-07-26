const { addGroupLog } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'ban',
  description: 'Permanently ban a member — reply, @mention, or /ban <user_id>',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('↩️ Reply to, @mention, or pass the user id of the member you want to ban.');
    if (String(target.id) === String(ctx.from.id)) return ctx.reply('❌ You cannot ban yourself.');

    await ctx.telegram.banChatMember(ctx.chat.id, target.id);
    addGroupLog(ctx.chat.id, { action: 'ban', by: ctx.from.id, target: target.id });
    await ctx.reply(`🔨 Banned ${target.first_name || target.username || target.id}.`);
  },
};
