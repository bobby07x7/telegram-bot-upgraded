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
  name: 'verify',
  description: 'Manually verify a member, bypassing captcha (reply to their message, admin only)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const target = ctx.message.reply_to_message?.from;
    if (!target) return ctx.reply('↩️ Reply to the member you want to verify.');
    const group = getGroup(ctx.chat.id);
    const verified = [...new Set([...group.verified, target.id])];
    saveGroup(ctx.chat.id, { verified });
    await ctx.reply(`✅ ${target.first_name} is now verified.`);
  },
};
