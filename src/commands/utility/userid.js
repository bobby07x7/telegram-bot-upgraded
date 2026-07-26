module.exports = {
  name: 'userid',
  description: "Get your (or a replied user's) Telegram ID",
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from || ctx.from;
    await ctx.reply(`🆔 User ID: \`${target.id}\`\nName: ${target.first_name}`, { parse_mode: 'Markdown' });
  },
};
