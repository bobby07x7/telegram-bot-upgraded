module.exports = {
  name: 'channelid',
  description: 'Get a forwarded channel post\'s source channel ID',
  execute: async (ctx) => {
    const forward = ctx.message.forward_from_chat;
    if (!forward) {
      await ctx.reply('❌ Forward a message from the channel first, then use /channelid.');
      return;
    }
    await ctx.reply(`🆔 Channel ID: \`${forward.id}\`\nTitle: ${forward.title}`, { parse_mode: 'Markdown' });
  },
};
