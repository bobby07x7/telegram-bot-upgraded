module.exports = {
  name: 'rate',
  description: 'Rate anything out of 10 — /rate pizza',
  execute: async (ctx) => {
    const thing = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!thing) {
      await ctx.reply('❓ Usage: /rate <anything>');
      return;
    }
    const score = Math.floor(Math.random() * 11);
    await ctx.reply(`⭐ I'd rate "${thing}" a ${score}/10`);
  },
};
