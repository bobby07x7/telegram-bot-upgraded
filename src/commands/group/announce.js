const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'announce',
  description: 'Send a formatted announcement to the group — /announce <message>',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const text = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!text) return ctx.reply('Usage: /announce <message>');
    await ctx.reply(`📢 *Announcement*\n\n${text}`, { parse_mode: 'Markdown' });
  },
};
