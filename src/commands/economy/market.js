const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'market',
  description: 'View the community market (items other users are trading)',
  execute: async (ctx) => {
    await ctx.reply('🏪 The community market is empty right now. Use /trade to list an item for another user.');
  },
};
