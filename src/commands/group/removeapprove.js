const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin, getReplyTarget } = require('../../core/permissions');

module.exports = {
  name: 'removeapprove',
  description: 'Remove a member\'s approved/trusted status (reply to their message)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const target = getReplyTarget(ctx);
    if (!target) return ctx.reply('↩️ Reply to the member you want to un-approve.');
    const group = getGroup(ctx.chat.id);
    const approved = (group.approved || []).filter((id) => id !== target.id);
    saveGroup(ctx.chat.id, { approved });
    await ctx.reply(`✅ Removed approved status from ${target.first_name}.`);
  },
};
