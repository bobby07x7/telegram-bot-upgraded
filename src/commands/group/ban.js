const { card, ICONS } = require('../../core/uiHelper');

module.exports = {
  name: 'ban',
  description: 'Ban a user (reply to their message)',
  category: 'group',
  ownerOnly: false, // group admins gate this via Telegram's own chat-admin permission check below
  execute: async (ctx) => {
    if (ctx.chat.type === 'private') return ctx.reply('This only works in groups.');

    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    if (!['administrator', 'creator'].includes(member.status)) {
      return ctx.reply(`${ICONS.fail} Only group admins can use this.`);
    }

    const target = ctx.message.reply_to_message?.from;
    if (!target) return ctx.reply('Reply to the message of the user you want to ban.');

    await ctx.telegram.banChatMember(ctx.chat.id, target.id);
    const text = card({
      icon: ICONS.group,
      title: 'User Banned',
      lines: [`👤 ${target.first_name} has been removed from the group.`],
    });
    await ctx.reply(text, { parse_mode: 'Markdown' });
  },
};
