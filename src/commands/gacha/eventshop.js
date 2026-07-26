const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'eventshop',
  description: 'View the event-exclusive shop (available during active events)',
  execute: async (ctx) => {
    await ctx.reply('🏪 The event shop is empty — it unlocks automatically during a live event.');
  },
};
