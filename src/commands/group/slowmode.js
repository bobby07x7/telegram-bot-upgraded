const { getGroup, saveGroup } = require('../../database/store');

module.exports = {
  name: 'slowmode',
  description: 'View slowmode status (native Telegram slow mode must be set via group settings by an admin)',
  execute: async (ctx) => {
    const chat = await ctx.telegram.getChat(ctx.chat.id);
    const delay = chat.slow_mode_delay || 0;
    await ctx.reply(delay ? `🐌 Current slowmode: ${delay}s between messages.` : '🐌 Slowmode is currently off. Set it from Telegram\'s native group settings.');
  },
};
