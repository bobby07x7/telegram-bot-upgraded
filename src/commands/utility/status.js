module.exports = {
  name: 'status',
  description: 'Quick bot health status',
  execute: async (ctx, { commands }) => {
    await ctx.reply(
      `✅ *Status: Online*\n` +
      `Commands loaded: ${commands.size}\n` +
      `Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB`,
      { parse_mode: 'Markdown' }
    );
  },
};
