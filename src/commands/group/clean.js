const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'clean',
  description: 'Delete the last N messages sent by the bot in this chat (admin only) — /clean <count>',
  execute: async (ctx) => {
    if (!(await requireGroupAdmin(ctx))) return;
    await ctx.reply('🧹 Note: Telegram bots can only delete messages they sent themselves, or any message if the bot is an admin with delete rights. Reply to a specific message with /clean to delete it, or configure bulk cleanup in your hosting logs.');
  },
};
