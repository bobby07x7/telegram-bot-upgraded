const { Markup } = require('telegraf');
const { config } = require('../../config/config');

module.exports = {
  name: 'support',
  description: 'Get support links',
  execute: async (ctx) => {
    await ctx.reply(
      '🆘 Need help? Reach us here:',
      Markup.inlineKeyboard([
        [Markup.button.url('💬 Support Group', config.links.supportGroup)],
        [Markup.button.url('📢 Announcements', config.links.supportChannel)],
      ])
    );
  },
};
