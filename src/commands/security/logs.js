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
  name: 'logs',
  description: 'View the last 10 moderation actions in this group',
  execute: async (ctx) => {
    const group = getGroup(ctx.chat.id);
    if (!group.logs.length) return ctx.reply('📜 No moderation actions logged yet.');
    const lines = group.logs.slice(0, 10).map((l) => `• [${new Date(l.at).toLocaleString()}] ${l.action} — by ${l.by} on ${l.target}`);
    await ctx.reply(`📜 *Recent Moderation Logs*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
