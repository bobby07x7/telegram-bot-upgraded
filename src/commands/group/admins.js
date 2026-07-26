const { getGroup, saveGroup } = require('../../database/store');

module.exports = {
  name: 'admins',
  description: 'List all admins in this group',
  execute: async (ctx) => {
    const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
    const lines = admins.map((a) => `• ${a.user.first_name}${a.status === 'creator' ? ' (Owner)' : ''}`);
    await ctx.reply(`👑 *Group Admins*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
