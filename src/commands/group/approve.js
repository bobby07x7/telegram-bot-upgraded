const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin, getReplyTarget } = require('../../core/permissions');

module.exports = {
  name: 'approve',
  description: 'Approve a member as trusted (exempt from anti-spam filters) — reply to their message',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const target = getReplyTarget(ctx);
    if (!target) return ctx.reply('↩️ Reply to the member you want to approve.');
    const group = getGroup(ctx.chat.id);
    const approved = group.approved || [];
    if (!approved.includes(target.id)) approved.push(target.id);
    saveGroup(ctx.chat.id, { approved });
    await ctx.reply(`✅ ${target.first_name} is now approved (exempt from filters).`);
  },
};
