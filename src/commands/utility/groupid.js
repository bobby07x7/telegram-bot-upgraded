module.exports = {
  name: 'groupid',
  description: 'Get the current group/chat ID',
  execute: async (ctx) => {
    await ctx.reply(`🆔 Chat ID: \`${ctx.chat.id}\`\nType: ${ctx.chat.type}`, { parse_mode: 'Markdown' });
  },
};
