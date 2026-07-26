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
  name: 'whitelist',
  description: 'Manage whitelisted domains (exempt from link protection) — /whitelist add|remove|list <domain>',
  execute: async (ctx) => {
    const [, sub, ...rest] = ctx.message.text.split(' ');
    const domain = rest.join(' ').trim().toLowerCase();
    const group = getGroup(ctx.chat.id);

    if (sub === 'list' || !sub) {
      if (!group.whitelist.length) return ctx.reply('📋 Whitelist is empty.');
      return ctx.reply(`📋 *Whitelisted domains:*\n${group.whitelist.map((d) => `• ${d}`).join('\n')}`, { parse_mode: 'Markdown' });
    }
    if (!(await requireGroupAdmin(ctx))) return;
    if (sub === 'add' && domain) {
      saveGroup(ctx.chat.id, { whitelist: [...new Set([...group.whitelist, domain])] });
      return ctx.reply(`✅ Whitelisted "${domain}".`);
    }
    if (sub === 'remove' && domain) {
      saveGroup(ctx.chat.id, { whitelist: group.whitelist.filter((d) => d !== domain) });
      return ctx.reply(`✅ Removed "${domain}" from whitelist.`);
    }
    await ctx.reply('Usage: /whitelist add|remove|list <domain>');
  },
};
