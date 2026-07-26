const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'event',
  description: 'View the current active gacha event',
  execute: async (ctx) => {
    await ctx.reply('🎉 No special event is currently active. Check back soon — follow the support channel for announcements!');
  },
};
