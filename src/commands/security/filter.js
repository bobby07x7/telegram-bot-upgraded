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
  name: 'filter',
  description: 'Set up an auto-reply trigger — /filter add <word> | <response>, /filter list, /filter remove <word>',
  execute: async (ctx) => {
    const [, sub, ...rest] = ctx.message.text.split(' ');
    const group = getGroup(ctx.chat.id);

    if (sub === 'list' || !sub) {
      if (!group.filters.length) return ctx.reply('📋 No filters set. Use /filter add <word> | <response>');
      return ctx.reply(`📋 *Active Filters*\n\n${group.filters.map((f) => `• ${f.trigger} → ${f.response}`).join('\n')}`, { parse_mode: 'Markdown' });
    }
    if (!(await requireGroupAdmin(ctx))) return;
    if (sub === 'add') {
      const [trigger, response] = rest.join(' ').split('|').map((s) => s.trim());
      if (!trigger || !response) return ctx.reply('Usage: /filter add <word> | <response>');
      saveGroup(ctx.chat.id, { filters: [...group.filters, { trigger: trigger.toLowerCase(), response }] });
      return ctx.reply(`✅ Filter added: "${trigger}" → "${response}"`);
    }
    if (sub === 'remove') {
      const trigger = rest.join(' ').trim().toLowerCase();
      saveGroup(ctx.chat.id, { filters: group.filters.filter((f) => f.trigger !== trigger) });
      return ctx.reply(`✅ Removed filter for "${trigger}".`);
    }
    await ctx.reply('Usage: /filter add|remove|list');
  },
};
