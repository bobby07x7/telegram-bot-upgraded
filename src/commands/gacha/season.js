const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'season',
  description: 'View the current gacha season info',
  execute: async (ctx) => {
    await ctx.reply('📅 Season 1 is currently active. Season-exclusive items will appear here when the season rotates.');
  },
};
