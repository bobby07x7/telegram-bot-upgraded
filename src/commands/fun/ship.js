module.exports = {
  name: 'ship',
  description: 'Ship yourself with a replied user',
  execute: async (ctx) => {
    const you = ctx.from.first_name;
    const them = ctx.message.reply_to_message?.from?.first_name;
    if (!them) {
      await ctx.reply('❓ Reply to someone\'s message to ship with them.');
      return;
    }
    const percent = Math.floor(Math.random() * 101);
    const bar = '💗'.repeat(Math.round(percent / 10)) + '🖤'.repeat(10 - Math.round(percent / 10));
    await ctx.reply(`💘 ${you} + ${them} = ${percent}% compatible\n${bar}`);
  },
};
