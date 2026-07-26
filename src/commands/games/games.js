module.exports = {
  name: 'games',
  description: 'List all available games',
  execute: async (ctx, { commands }) => {
    const gameCommands = [...commands.values()].filter((c) => c.category === 'games');
    const lines = gameCommands.map((c) => `🎮 /${c.name} — ${c.description}`);
    await ctx.reply(`*Available Games*\n\n${lines.join('\n')}`, { parse_mode: 'Markdown' });
  },
};
