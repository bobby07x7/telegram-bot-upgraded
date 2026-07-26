const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'monitor',
  description: 'View live system resource usage',
  ownerOnly: true,
  execute: async (ctx) => {
    const mem = process.memoryUsage();
    const uptime = process.uptime();
    await ctx.reply(
      `📊 *System Monitor*\n\n` +
      `Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m\n` +
      `RSS Memory: ${(mem.rss / 1024 / 1024).toFixed(1)} MB\n` +
      `Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB\n` +
      `Total Users: ${getAllUserIds().length}`,
      { parse_mode: 'Markdown' }
    );
  },
};
