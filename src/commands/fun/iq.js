module.exports = {
  name: 'iq',
  description: 'Get a random (fun, not real) IQ score',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from?.first_name || ctx.from.first_name;
    const iq = Math.floor(Math.random() * 100) + 50;
    await ctx.reply(`🧠 ${target}'s IQ is: ${iq}\n_(purely for fun — not a real test)_`, { parse_mode: 'Markdown' });
  },
};
