const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'clearwarn',
  description: 'Reset all warnings for a member — reply, @mention, or user id',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const { target } = resolveTarget(ctx, { allowIdArg: true });
    if (!target) return ctx.reply('↩️ Reply to, @mention, or pass the user id of the member whose warnings you want to clear.');

    const group = getGroup(ctx.chat.id);
    const warnings = group.warnings || {};
    delete warnings[target.id];
    saveGroup(ctx.chat.id, { warnings });
    await ctx.reply(`✅ Cleared warnings for ${target.first_name || target.username || target.id}.`);
  },
};
