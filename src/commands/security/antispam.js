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
  name: 'antispam',
  description: 'Toggle Anti-spam protection on/off (admin only)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const group = getGroup(ctx.chat.id);
    const newValue = !group.settings.antispam;
    saveGroup(ctx.chat.id, { settings: { ...group.settings, antispam: newValue } });
    await ctx.reply(`🚫 Anti-spam is now ${newValue ? 'ENABLED ✅' : 'DISABLED ❌'}.`);
  },
};
