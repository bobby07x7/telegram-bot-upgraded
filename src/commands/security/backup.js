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
  name: 'backup',
  description: 'Export this group\'s settings as a JSON backup (admin only)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const group = getGroup(ctx.chat.id);
    const json = JSON.stringify(group, null, 2);
    await ctx.reply(`💾 *Group Settings Backup*\n\n\`\`\`json\n${json.slice(0, 3500)}\n\`\`\``, { parse_mode: 'Markdown' });
  },
};
