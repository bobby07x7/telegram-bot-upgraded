const { getGroup, saveGroup, addGroupLog } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'warn',
  description: 'Issue a warning to a member (3 warnings = auto-mute) — reply, @mention, or user id',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('↩️ Reply to, @mention, or pass the user id of the member you want to warn.');

    const group = getGroup(ctx.chat.id);
    const warnings = group.warnings || {};
    warnings[target.id] = (warnings[target.id] || 0) + 1;
    saveGroup(ctx.chat.id, { warnings });

    const name = target.first_name || target.username || target.id;
    if (warnings[target.id] >= 3) {
      await ctx.telegram.restrictChatMember(ctx.chat.id, target.id, { permissions: { can_send_messages: false } });
      addGroupLog(ctx.chat.id, { action: 'auto-mute (3 warns)', by: ctx.from.id, target: target.id });
      await ctx.reply(`⚠️ ${name} reached 3 warnings and has been muted.`);
    } else {
      addGroupLog(ctx.chat.id, { action: 'warn', by: ctx.from.id, target: target.id });
      await ctx.reply(`⚠️ Warned ${name} (${warnings[target.id]}/3).`);
    }
  },
};
