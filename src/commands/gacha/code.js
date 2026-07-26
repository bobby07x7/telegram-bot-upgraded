const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'code',
  description: 'Alias for /gacharedeem — redeem a gacha code',
  execute: async (ctx, extras) => extras.commands.get('gacharedeem').execute(ctx, extras),
};
