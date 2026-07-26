module.exports = {
  name: 'luck',
  description: "Check today's luck percentage",
  execute: async (ctx) => {
    const luck = Math.floor(Math.random() * 101);
    const emoji = luck > 75 ? '🍀' : luck > 40 ? '🙂' : '😬';
    await ctx.reply(`${emoji} Your luck today: ${luck}%`);
  },
};
