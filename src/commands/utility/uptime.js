module.exports = {
  name: 'uptime',
  description: 'See how long the bot has been running',
  execute: async (ctx) => {
    const s = process.uptime();
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    await ctx.reply(`⏱️ Uptime: ${d}d ${h}h ${m}m ${sec}s`);
  },
};
