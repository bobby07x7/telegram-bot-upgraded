module.exports = {
  name: 'partner',
  description: 'Randomly assign a partner from recent chat activity',
  execute: async (ctx) => {
    const you = ctx.from.first_name;
    const partner = ctx.message.reply_to_message?.from?.first_name || 'a mystery admirer 👀';
    await ctx.reply(`💑 ${you}'s partner for today is: ${partner}`);
  },
};
