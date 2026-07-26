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
  name: 'audit',
  description: 'Full audit summary of group security settings and recent actions',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const group = getGroup(ctx.chat.id);
    const settingsLines = Object.entries(group.settings).map(([k, v]) => `${v ? '✅' : '❌'} ${k}`);
    await ctx.reply(
      `🔍 *Security Audit*\n\n*Settings:*\n${settingsLines.join('\n')}\n\n*Blacklist:* ${group.blacklist.length} word(s)\n*Recent actions logged:* ${group.logs.length}`,
      { parse_mode: 'Markdown' }
    );
  },
};
