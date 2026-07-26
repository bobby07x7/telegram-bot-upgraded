const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'rules',
  description: 'Set or view the group rules — /rules <text> (admin to set)',
  execute: async (ctx) => {
    const text = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    const group = getGroup(ctx.chat.id);

    if (!text) return ctx.reply(group.rules ? `📜 *Group Rules*\n\n${group.rules}` : '📜 No rules set yet. Admins can set them with /rules <text>.', { parse_mode: 'Markdown' });
    if (!(await requireGroupAdmin(ctx))) return;
    saveGroup(ctx.chat.id, { rules: text });
    await ctx.reply('✅ Rules updated.');
  },
};
