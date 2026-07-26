const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'tagall',
  description: 'Mention every admin in the group, with an optional message — /tagall <message>',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;

    const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
    const mentions = admins.filter((a) => !a.user.is_bot).map((a) => `[${a.user.first_name}](tg://user?id=${a.user.id})`);

    if (!mentions.length) return ctx.reply('No taggable admins found in this group.');

    const note = ctx.message.text.split(' ').slice(1).join(' ').trim();
    const header = note ? `📢 *${note}*\n\n` : `📢 *Attention*\n\n`;

    await ctx.reply(`${header}${mentions.join('  ')}`, { parse_mode: 'Markdown' });
  },
};
