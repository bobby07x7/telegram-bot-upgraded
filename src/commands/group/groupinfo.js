const { getGroup, saveGroup } = require('../../database/store');

module.exports = {
  name: 'groupinfo',
  description: 'View detailed information about this group',
  execute: async (ctx) => {
    const chat = await ctx.telegram.getChat(ctx.chat.id);
    const memberCount = await ctx.telegram.getChatMembersCount(ctx.chat.id);
    await ctx.reply(
      `ℹ️ *Group Info*\n\nName: ${chat.title}\nID: ${chat.id}\nType: ${chat.type}\nMembers: ${memberCount}\nDescription: ${chat.description || 'None'}`,
      { parse_mode: 'Markdown' }
    );
  },
};
