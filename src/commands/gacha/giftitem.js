const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'giftitem',
  description: 'Gift a gacha item to another user (reply to their message)',
  execute: async (ctx, extras) => extras.commands.get('gift').execute(ctx, extras),
};
