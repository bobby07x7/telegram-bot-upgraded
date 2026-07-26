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
  name: 'restore',
  description: 'Restore group settings from a backup — reply to a /backup JSON message with /restore',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const replied = ctx.message.reply_to_message?.text;
    if (!replied) return ctx.reply('↩️ Reply to a message containing the JSON backup.');
    const match = replied.match(/\{[\s\S]*\}/);
    if (!match) return ctx.reply('❌ No valid JSON found in that message.');
    try {
      const parsed = JSON.parse(match[0]);
      saveGroup(ctx.chat.id, parsed);
      await ctx.reply('✅ Settings restored from backup.');
    } catch (err) {
      await ctx.reply(`❌ Failed to parse backup JSON: ${err.message}`);
    }
  },
};
