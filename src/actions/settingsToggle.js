const { Markup } = require('telegraf');
const { getUser, saveUser } = require('../database/store');

module.exports = {
  id: 'settings:toggle_notifications',
  handler: async (ctx) => {
    const user = getUser(ctx.from.id);
    const newValue = !user.settings.notifications;
    saveUser(ctx.from.id, { settings: { ...user.settings, notifications: newValue } });

    await ctx.answerCbQuery(newValue ? 'Notifications ON' : 'Notifications OFF');
    const label = newValue ? '🔔 Notifications: ON' : '🔕 Notifications: OFF';
    await ctx.editMessageText('⚙️ *Your Settings*', {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback(label, 'settings:toggle_notifications')]]),
    });
  },
};
