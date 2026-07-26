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
  name: 'blacklist',
  description: 'Manage blacklisted words — /blacklist add|remove|list <word>',
  execute: async (ctx) => {
    const [, sub, ...rest] = ctx.message.text.split(' ');
    const word = rest.join(' ').trim().toLowerCase();
    const group = getGroup(ctx.chat.id);

    if (sub === 'list' || !sub) {
      if (!group.blacklist.length) return ctx.reply('📋 Blacklist is empty.');
      return ctx.reply(`📋 *Blacklisted words:*\n${group.blacklist.map((w) => `• ${w}`).join('\n')}`, { parse_mode: 'Markdown' });
    }
    if (!(await requireGroupAdmin(ctx))) return;
    if (sub === 'add' && word) {
      saveGroup(ctx.chat.id, { blacklist: [...new Set([...group.blacklist, word])] });
      return ctx.reply(`✅ Added "${word}" to blacklist.`);
    }
    if (sub === 'remove' && word) {
      saveGroup(ctx.chat.id, { blacklist: group.blacklist.filter((w) => w !== word) });
      return ctx.reply(`✅ Removed "${word}" from blacklist.`);
    }
    await ctx.reply('Usage: /blacklist add|remove|list <word>');
  },
};
