module.exports = {
  name: 'stats',
  description: 'View bot statistics (owner only)',
  ownerOnly: true,
  execute: async (ctx) => {
    const uptimeSec = Math.floor(process.uptime());
    const mem = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    await ctx.reply(
      `📊 *Bot Stats*\n` +
      `Uptime: ${uptimeSec}s\n` +
      `Memory: ${mem} MB\n` +
      `Node: ${process.version}`,
      { parse_mode: 'Markdown' }
    );
  },
};
