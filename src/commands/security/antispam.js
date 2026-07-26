const { getGroup, saveGroup } = require('../../database/store');
const { card, ICONS } = require('../../core/uiHelper');

module.exports = {
  name: 'antispam',
  description: 'Toggle anti-spam protection for this group',
  category: 'security',
  ownerOnly: false,
  execute: async (ctx) => {
    if (ctx.chat.type === 'private') return ctx.reply('This only works in groups.');
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    if (!['administrator', 'creator'].includes(member.status)) {
      return ctx.reply(`${ICONS.fail} Only group admins can use this.`);
    }

    const group = getGroup(ctx.chat.id);
    const next = !group.security.antiSpam;
    saveGroup(ctx.chat.id, { security: { ...group.security, antiSpam: next } });

    const text = card({
      icon: ICONS.security,
      title: 'Anti-Spam',
      lines: [`Status: ${next ? `${ICONS.success} Enabled` : `${ICONS.fail} Disabled`}`],
    });
    await ctx.reply(text, { parse_mode: 'Markdown' });
  },
};
