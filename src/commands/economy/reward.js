const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'reward',
  description: 'View available reward sources (daily, weekly, referral, events)',
  execute: async (ctx) => {
    await ctx.reply(
      '🎁 *Reward Sources*\n\n' +
      '/daily — every 24h\n/weekly — every 7 days\n/monthly — every 30 days\n' +
      '/referral — invite friends\n/spin — gacha rewards\n/claim — pending rewards',
      { parse_mode: 'Markdown' }
    );
  },
};
