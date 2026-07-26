const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'shutdown',
  description: 'Shut down the bot process completely',
  ownerOnly: true,
  execute: async (ctx) => {
    await ctx.reply('🛑 Shutting down...');
    setTimeout(() => process.exit(0), 500);
  },
};
