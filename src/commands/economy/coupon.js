const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'coupon',
  description: 'View info about the coupon/redeem code system',
  execute: async (ctx) => {
    await ctx.reply('🎟️ Got a coupon code? Use /redeem <code> to claim it.');
  },
};
