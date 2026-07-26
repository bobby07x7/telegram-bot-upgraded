const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'merge',
  description: 'Alias for /upgrade — merge 3 same-rarity items into a better one',
  execute: async (ctx, extras) => extras.commands.get('upgrade').execute(ctx, extras),
};
