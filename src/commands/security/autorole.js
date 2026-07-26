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
  name: 'autorole',
  description: 'Assign a custom label/role tag to a member — /autorole <role> (reply to their message)',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    const target = ctx.message.reply_to_message?.from;
    const role = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!target || !role) return ctx.reply('↩️ Reply to a member with: /autorole <role name>');
    const group = getGroup(ctx.chat.id);
    saveGroup(ctx.chat.id, { roles: { ...group.roles, [target.id]: role } });
    await ctx.reply(`🏷️ ${target.first_name} tagged as "${role}".\n(Note: this is a bot-tracked label, not a native Telegram admin role.)`);
  },
};
