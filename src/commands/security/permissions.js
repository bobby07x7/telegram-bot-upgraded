const { getGroup, saveGroup, addGroupLog } = require('../../database/store');

async function requireGroupAdmin(ctx) {
  if (ctx.chat.type === 'private') {
    await ctx.reply('❌ This command only works in groups.');
    return false;
  }
  const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
  if (!['administrator', 'creator'].includes(member.status)) {
    await ctx.reply('🚫 You need to be a group admin to use this command.');
    return false;
  }
  return true;
}

module.exports = {
  name: 'permissions',
  description: 'View this chat\'s current default member permissions',
  execute: async (ctx) => {
    const chat = await ctx.telegram.getChat(ctx.chat.id);
    const perms = chat.permissions || {};
    const lines = Object.entries(perms).map(([k, v]) => `${v ? '✅' : '❌'} ${k}`);
    await ctx.reply(`🔑 *Chat Permissions*\n\n${lines.join('\n') || 'Not available for this chat type.'}`, { parse_mode: 'Markdown' });
  },
};
