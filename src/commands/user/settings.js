const { Markup } = require('telegraf');
const { getUser } = require('../../database/store');

module.exports = {
  name: 'settings',
  description: 'View and toggle your personal settings',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const notifLabel = user.settings.notifications ? '🔔 Notifications: ON' : '🔕 Notifications: OFF';

    await ctx.reply('⚙️ *Your Settings*', {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback(notifLabel, 'settings:toggle_notifications')]]),
    });
  },
};
