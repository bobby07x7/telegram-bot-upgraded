const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'restart',
  description: 'Restart the bot process (requires a process manager like PM2 to auto-restart)',
  ownerOnly: true,
  execute: async (ctx) => {
    await ctx.reply('♻️ Restarting...');
    setTimeout(() => process.exit(0), 500);
  },
};
