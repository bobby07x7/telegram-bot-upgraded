const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'rewards',
  description: 'View your available gacha reward sources',
  execute: async (ctx) => {
    await ctx.reply('🎁 Gacha rewards come from: /spin (daily free spins), /event bonuses, and /gacharedeem codes.');
  },
};
